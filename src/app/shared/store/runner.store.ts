import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap } from 'rxjs';
import { RunnerService } from '../service/runner.service';
import { User } from './user.store';

export interface Runner {
  user: User;
  status: 'Unverified' | 'Verified' | 'Rejected' | 'Suspended';
  isOnDuty: boolean;
  vehicle?: Vehicle;
  verifier?: User;
}

export interface Vehicle {
  id: string;
  plateNo: string;
  type: VehicleType;
}

export interface VehicleType {
  id: string;
  name: string;
  description: string;
}

type RunnerState = {
  runners: Runner[] | null;
  status: 'idle' | 'loading' | 'success' | 'error';
};

const initialState: RunnerState = {
  runners: null,
  status: 'idle',
};

export const RunnerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, runnerService = inject(RunnerService)) => ({
    getAll: rxMethod(
      pipe(
        tap(() => {
          patchState(store, { status: 'loading' });
        }),
        switchMap(() => runnerService.getAll()),
        tap((response) => {
          patchState(store, { status: 'success', runners: response });
        })
      )
    ),
  }))
);
