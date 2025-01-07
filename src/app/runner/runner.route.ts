import { Route } from '@angular/router';

const RunnerRoute: Route = {
  title: 'Runner',
  path: 'runner',
  loadComponent: () =>
    import('./runner.component').then((m) => m.RunnerComponent),
};

export const RunnerRoutes: Route[] = [RunnerRoute];
