import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FulltimerLocationPage } from './fulltimer-location.page';

const routes: Routes = [
  {
    path: '',
    component: FulltimerLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FulltimerLocationPageRoutingModule {}
