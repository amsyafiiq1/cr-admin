import { Route } from '@angular/router';

export const LoginRoute: Route = {
  path: 'login',
  loadComponent: () =>
    import('./login.component').then((m) => m.LoginComponent),
};

export const LOGIN_ROUTES = [LoginRoute];
