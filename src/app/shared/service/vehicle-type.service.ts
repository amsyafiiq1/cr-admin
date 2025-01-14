import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { from, map } from 'rxjs';
import { VehicleType } from '../store/runner.store';

@Injectable({
  providedIn: 'root',
})
export class VehicleTypeService {
  supabase = inject(DataService).supabase;

  getAll() {
    const promise = this.supabase.from('Vehicle_Type').select('*');
    return from(promise).pipe(
      map((response) => {
        return response.data! as VehicleType[];
      })
    );
  }
}
