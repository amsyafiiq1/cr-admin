import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AuthService } from '../service/auth.service';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';

export interface User {
  email: string;
  username: string;
}

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    register: rxMethod<{ username: string; email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { user: null })),
        switchMap(({ username, email, password }) =>
          authService.register(username, email, password).pipe(
            tap((result) => {
              if (result.error) {
                alert(result.error);
              } else {
                patchState(store, {
                  user: {
                    email: result.data.user?.email!,
                    username:
                      result.data.user?.identities?.at(0)?.identity_data?.[
                        'username'
                      ]!,
                  },
                });
              }
            })
          )
        ),
        catchError((error) => {
          alert(error);
          return EMPTY;
        })
      )
    ),
    login: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { user: null })),
        switchMap(({ email, password }) =>
          authService.login(email, password).pipe(
            tap((result) => {
              if (result.error) {
                alert(result.error);
              } else {
                patchState(store, {
                  user: {
                    email: result.data.user?.email!,
                    username:
                      result.data.user?.identities?.at(0)?.identity_data?.[
                        'username'
                      ]!,
                  },
                });
              }
            })
          )
        ),
        catchError((error) => {
          alert(error);
          return EMPTY;
        })
      )
    ),
    setUser: (user: User) => patchState(store, { user }),
    logout: () => {
      authService.logout();
      patchState(store, { user: null });
    },
  })),
  withHooks({
    onInit: (store, authService = inject(AuthService)) => {
      authService.supabase.auth.onAuthStateChange((event, session) => {
        console.log(event, session);
        if (event === 'SIGNED_IN') {
          patchState(store, {
            user: {
              email: session?.user.email!,
              username:
                session?.user.identities?.at(0)?.identity_data?.['username']!,
            },
          });
        } else if (event === 'SIGNED_OUT') {
          patchState(store, { user: null });
        }
      });
    },
  })
);
