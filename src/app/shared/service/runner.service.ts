import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { from, map, Observable, Subject, tap } from 'rxjs';
import { Runner } from '../store/runner.store';

@Injectable({
  providedIn: 'root',
})
export class RunnerService {
  dataService = inject(DataService);
  supabase = this.dataService.supabase;
  changes = new Subject<any>();

  getAll(): Observable<Runner[]> {
    const promise = this.supabase.from('Runner').select(
      `isOnDuty, status, 
        user:User!id(*), 
        vehicle:Vehicle_Details!vehicle_id(*), 
        verifier:Admin!verifier_id(
          user:User!id(*)
      )`
    );

    return from(promise).pipe(
      map((response) => {
        return response.data! as any;
      })
    );
  }

  updateStatus(
    id: string,
    verifier_id: string,
    status: 'Unverified' | 'Verified' | 'Rejected' | 'Suspended'
  ): Observable<Runner> {
    const promise = this.supabase
      .from('Runner')
      .update({ status: status, verifier_id: verifier_id })
      .eq('id', id)
      .select(
        `isOnDuty, status, 
        user:User!id(*), 
        vehicle:Vehicle_Details!vehicle_id(*), 
        verifier:Admin!verifier_id(
          user:User!id(*)
      )`
      )
      .single();

    return from(promise).pipe(
      map((res) => {
        return res.data! as any;
      })
    );
  }

  onChanges() {
    this.supabase
      .channel('custom-all-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Runner' },
        (payload) => {
          this.changes.next(payload.new as any);
        }
      )
      .subscribe();

    return this.changes.asObservable();
  }
}
