import { inject, Injectable } from '@angular/core';
import { AuthResponse, User as SupabaseUser } from '@supabase/supabase-js';
import { DataService } from './data.service';
import { Observable, from, map, tap } from 'rxjs';
import { User } from '../store/user.store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  dataService = inject(DataService);
  supabase = this.dataService.supabase;

  register(user: User): Observable<AuthResponse> {
    const promise = this.supabase.auth.signUp({
      email: user.email!,
      password: user.password!,
    });

    return from(promise);
  }

  saveUser(user: any): Observable<User> {
    const promise = this.supabase
      .from('User')
      .insert([
        {
          email: user.email,
          name: user.name,
          phone: user.phone,
          type: user.type,
          photo: user.photo,
          supabase_uuid: user.supabase_uuid,
          id: user.id,
        },
      ])
      .select();
    return from(promise).pipe(
      tap((res) => {
        this.savePerRole(user);
      }),
      map((response) => {
        console.log(response, response.data);
        return response.data![0];
      })
    );
  }

  getUsers(): Observable<User[]> {
    const promise = this.supabase.from('User').select('*');

    return from(promise).pipe(
      map((response) => {
        return response.data!;
      })
    );
  }

  getRunner(): Observable<User[]> {
    const promise = this.supabase.from('Runner').select(`*, User(*)`);

    return from(promise).pipe(
      map((response) => {
        return response.data!;
      })
    );
  }

  async savePerRole(user: any) {
    if (user.type === 'Administrator') {
      const { data, error } = await this.supabase.from('Admin').insert({
        id: user.id,
      });
    } else if (user.type === 'Runner') {
      console.log('Runner');
      const { data, error } = await this.supabase
        .from('Vehicle_Details')
        .insert({
          type_id: user.vehicle,
          plate_no: user.plate,
        })
        .select()
        .single();

      console.log(data, error);

      await this.supabase.from('Runner').insert({
        id: user.id,
        status: 'Unverified',
        isOnDuty: false,
        vehicle_id: data.id,
      });
    } else {
      const { data, error } = await this.supabase.from('Customer').insert({
        id: user.id,
      });
    }
  }
}
