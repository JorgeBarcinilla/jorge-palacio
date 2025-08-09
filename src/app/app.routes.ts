import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    loadComponent: () =>
      import('./pages/landing/landing').then((m) => m.Landing),
    path: '',
  },
];
