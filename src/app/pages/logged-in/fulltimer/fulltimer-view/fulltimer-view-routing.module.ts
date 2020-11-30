import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FulltimerViewPage } from './fulltimer-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: FulltimerViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FulltimerViewPageRoutingModule {}
