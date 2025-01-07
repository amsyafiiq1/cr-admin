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

export interface AuthUser {
  uuid: string;
  uitmId: string;
  email: string;
  name: string;
  phone: string;
  type: 'Administrator' | 'User' | 'Runner';
  photo?: string;
  token?: string;
}

type AuthState = {
  user: AuthUser | null;
};

const initialState: AuthState = {
  user: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { user: null })),
        switchMap(({ email, password }) =>
          authService.login(email, password).pipe(
            tap((result) => {
              if (result.error) {
                alert(result.error);
              } else {
                authService.getUserFromUUID(result.data.user?.id!).pipe(
                  tap((user) => {
                    patchState(store, {
                      user: {
                        email: result.data.user?.email!,
                        name: user?.name!,
                        uuid: user?.supabase_uuid!,
                        uitmId: user?.id!,
                        type: user?.type!,
                        phone: user?.phone!,
                        photo: (user?.photo as string) ?? undefined,
                      },
                    });
                  })
                );
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
    setUser: (user: AuthUser) => patchState(store, { user }),
    logout: () => {
      authService.logout();
      patchState(store, { user: null });
    },
  })),
  withHooks({
    onInit: (store, authService = inject(AuthService)) => {
      authService.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          console.log(store.user(), session);
          if (store.user()?.email === session?.user.email) {
            return;
          }

          authService.getUserFromUUID(session?.user.id!).subscribe((user) => {
            patchState(store, {
              user: {
                email: session?.user.email!,
                name: user?.name!,
                uuid: user?.supabase_uuid!,
                uitmId: user?.id!,
                type: user?.type!,
                phone: user?.phone!,
                photo: (user?.photo as string) ?? undefined,
              },
            });
          });
        } else if (event === 'SIGNED_OUT') {
          patchState(store, { user: null });
        }
      });
    },
  })
);
