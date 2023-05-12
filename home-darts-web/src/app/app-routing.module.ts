import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'around-the-clock',
  },
  {
    path: 'around-the-clock',
    loadChildren: () => import('./around-the-clock/around-the-clock.module').then(m => m.AroundTheClockModule),
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
