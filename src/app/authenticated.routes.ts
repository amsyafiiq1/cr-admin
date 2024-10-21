import { Route, Routes } from '@angular/router';
import { UserRoutes } from './user/user.route';

export const HomeRoute: Route = {
  path: '',
  loadComponent: () =>
    import('./home/home.component').then((m) => m.HomeComponent),
  children: [...UserRoutes],
};

export const AuthenticatedRoutes: Routes = [HomeRoute];
