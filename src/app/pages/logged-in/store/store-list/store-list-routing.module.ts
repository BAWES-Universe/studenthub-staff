import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreListPage } from './store-list.page';

const routes: Routes = [
  {
    path: '',
    component: StoreListPage
  },{
    path: ':id',
    component: StoreListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreListPageRoutingModule {}
