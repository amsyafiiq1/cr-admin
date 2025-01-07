import { Route, Routes } from '@angular/router';
import { UserRoutes } from './user/user.route';
import { RunnerRoutes } from './runner/runner.route';

export const HomeRoute: Route = {
  path: '',
  loadComponent: () =>
    import('./home/home.component').then((m) => m.HomeComponent),
  children: [...UserRoutes, ...RunnerRoutes],
};

export const AuthenticatedRoutes: Routes = [HomeRoute];
