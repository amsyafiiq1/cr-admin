import { Route } from '@angular/router';

const UserRoute: Route = {
  path: 'user',
  title: 'User',
  loadComponent: () => import('./user.component').then((m) => m.UserComponent),
};

const AddUserRoute: Route = {
  path: 'user/add',
  title: 'Add User',
  loadComponent: () =>
    import('./add/add.component').then((m) => m.AddComponent),
};

export const UserRoutes: Route[] = [UserRoute, AddUserRoute];
