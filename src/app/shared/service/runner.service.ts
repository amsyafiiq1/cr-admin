import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { from, map, Observable } from 'rxjs';
import { Runner } from '../store/runner.store';

@Injectable({
  providedIn: 'root',
})
export class RunnerService {
  dataService = inject(DataService);
  supabase = this.dataService.supabase;

  getAll(): Observable<Runner[]> {
    const promise = this.supabase
      .from('Runner')
      .select(`isOnDuty, status, User(*), Vehicle_Details(*)`);

    return from(promise).pipe(
      map((response) => {
        return response.data!.map((item: any) => ({
          isOnDuty: item.isOnDuty,
          status: item.status,
          user: item.User,
          vehicle: item.Vehicle_Details,
        }));
      })
    );
  }
}
