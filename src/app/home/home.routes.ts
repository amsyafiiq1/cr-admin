import { Route, Routes } from '@angular/router';

export const HomeRoute: Route = {
  path: '',
  loadComponent: () => import('./home.component').then((m) => m.HomeComponent),
};

export const HOME_ROUTES: Routes = [HomeRoute];
