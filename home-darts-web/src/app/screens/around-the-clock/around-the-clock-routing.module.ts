import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtcStartComponent } from './components/atc-start/atc-start.component';
import { AtcGameComponent } from './components/atc-game/atc-game.component';
import { AtcGameIdParamGuard } from './guards/atc-game-id-param.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AtcStartComponent,
  },
  {
    path: ':gameId',
    component: AtcGameComponent,
    canActivate: [AtcGameIdParamGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AroundTheClockRoutingModule { }
