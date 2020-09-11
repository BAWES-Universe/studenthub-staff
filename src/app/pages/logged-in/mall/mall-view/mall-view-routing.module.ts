import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MallViewPage } from './mall-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: MallViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MallViewPageRoutingModule {}
