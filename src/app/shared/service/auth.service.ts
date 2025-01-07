import { inject, Injectable } from '@angular/core';
import { AuthResponse, createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { from, map, Observable } from 'rxjs';
import { DataService } from './data.service';
import { User } from '../store/user.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  dataService = inject(DataService);
  supabase = this.dataService.supabase;

  login(email: string, password: string): Observable<AuthResponse> {
    const promise = this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return from(promise);
  }

  getUserFromUUID(uuid: string): Observable<User | null> {
    const promise = this.supabase
      .from('User')
      .select('*')
      .eq('supabase_uuid', uuid);

    return from(promise).pipe(
      map((response) => {
        return response.data ? response.data[0] : null;
      })
    );
  }

  logout(): void {
    this.supabase.auth.signOut();
  }
}
