import { Route } from '@angular/router';

const UserRoute: Route = {
  path: 'user',
  title: 'User',
  loadComponent: () => import('./user.component').then((m) => m.UserComponent),
};

export const UserRoutes: Route[] = [UserRoute];
