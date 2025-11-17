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
  {
    path: 'blog',
    loadComponent: () => 
      import('./features/blog/pages/posts-list/posts-list.component')
        .then(c => c.PostsListComponent)
  },
  {
    path: 'blog/new',
    loadComponent: () => 
      import('./features/blog/pages/post-form/post-form.component')
        .then(c => c.PostFormComponent)
  },
  {
    path: 'blog/edit/:id',
    loadComponent: () => 
      import('./features/blog/pages/post-form/post-form.component')
        .then(c => c.PostFormComponent)
  },
  {
    path: 'compare',
    loadComponent: () => 
      import('./features/compare/pages/driver-compare/driver-compare.component')
        .then(c => c.DriverCompareComponent)
  },
  { path: '', redirectTo: 'races', pathMatch: 'full' },
  { path: '**', redirectTo: 'races' }
];
