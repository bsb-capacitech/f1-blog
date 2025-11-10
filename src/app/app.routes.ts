import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'races', loadComponent: () => import('./features/races/pages/races-list/races-list.component').then(c => c.RacesListComponent)
  },
  {
    path: 'races/:sessionKey', loadComponent: () => import('./features/races/pages/race-details/race-details.component').then(c => c.RaceDetailsComponent)
  },
  {
    path: 'drivers', loadComponent: () => import('./features/drivers/pages/drivers-list/drivers-list.component').then(c => c.DriversListComponent)
  },
  { path: '', redirectTo: 'races', pathMatch: 'full' },
  { path: '**', redirectTo: 'races' }
];
