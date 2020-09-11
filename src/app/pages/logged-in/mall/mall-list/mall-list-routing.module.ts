import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MallListPage } from './mall-list.page';

const routes: Routes = [
  {
    path: '',
    component: MallListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MallListPageRoutingModule {}
