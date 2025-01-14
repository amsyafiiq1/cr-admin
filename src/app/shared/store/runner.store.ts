import { inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, Observable } from 'rxjs';
import { RunnerService } from '../service/runner.service';
import { User } from './user.store';

export interface Runner {
  user: User;
  status: 'Unverified' | 'Verified' | 'Rejected' | 'Suspended';
  isOnDuty: boolean;
  vehicle?: Vehicle;
  verifier?: { user: User };
}

export interface Vehicle {
  id: string;
  plateNo: string;
  type: VehicleType;
}

export interface VehicleType {
  id: number;
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
    updateStatus: rxMethod<{
      id: string;
      verifierId: string;
      status: 'Unverified' | 'Verified' | 'Rejected' | 'Suspended';
    }>(
      pipe(
        tap(() => {
          patchState(store, { status: 'loading' });
        }),
        switchMap((data) =>
          runnerService.updateStatus(data.id, data.verifierId, data.status)
        ),
        tap((res) => {
          patchState(store, {
            status: 'success',
            runners: store.runners()!.map((runner) => {
              return runner.user.id === res.user.id ? res : runner;
            }),
          });
        })
      )
    ),
  })),
  withHooks((store, runnerService = inject(RunnerService)) => ({
    onInit() {
      runnerService.changes.subscribe((runner) => {
        patchState(store, {
          runners: store.runners()!.map((r) => {
            console.log(runner);
            if (r.user.id === runner.id) {
              return {
                ...r,
                isOnDuty: runner.isOnDuty,
                status: runner.status,
              };
            } else {
              return r;
            }
          }),
        });
      });
    },
  }))
);
