import { Routes } from '@angular/router';
import { LOGIN_ROUTES } from './login/login.routes';
import { AuthenticatedRoutes } from './authenticated.routes';

export const routes: Routes = [...LOGIN_ROUTES, ...AuthenticatedRoutes];
