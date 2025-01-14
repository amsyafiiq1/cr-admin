import { inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY, map, repeat } from 'rxjs';
import { UserService } from '../service/user.service';
import { AvatarService } from '../service/avatar.service';

export interface User {
  id?: string;
  supabase_uuid?: string;
  name?: string;
  phone?: string;
  created_at?: string;
  photo: string | File | undefined;
  type: 'Administrator' | 'User' | 'Runner';
  email?: string;
  password?: string;
}

type UserState = {
  users: User[] | null;
  status: 'idle' | 'loading' | 'success' | 'error';
};

const initialState: UserState = {
  users: null,
  status: 'idle',
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      userService = inject(UserService),
      avatarService = inject(AvatarService)
    ) => ({
      addUser: rxMethod<any>(
        pipe(
          switchMap((user) =>
            userService.register(user).pipe(
              tap((res) => {
                avatarService.uploadAvatar(
                  user.photo as File,
                  res.data.user?.id!
                );
                user.photo = avatarService.getAvatar(res.data.user?.id!);
                return user;
              }),
              switchMap((res) => {
                return userService
                  .saveUser({
                    ...user,
                    id: user.id,
                    supabase_uuid: res.data.user?.id!,
                  })
                  .pipe(
                    tap(() => {
                      patchState(store, {
                        status: 'success',
                        ...store.users,
                        ...res,
                      });
                    })
                  );
              }),
              catchError((error) => {
                console.log(error);
                patchState(store, { status: 'error' });
                return EMPTY;
              })
            )
          )
        )
      ),
      getUsers: rxMethod(
        pipe(
          tap(() => patchState(store, { users: null, status: 'loading' })),
          switchMap(() =>
            userService.getUsers().pipe(
              tap((users) => {
                patchState(store, { users, status: 'idle' });
              })
            )
          )
        )
      ),
    })
  ),
  withHooks({
    onInit: (store) => {},
  })
);
