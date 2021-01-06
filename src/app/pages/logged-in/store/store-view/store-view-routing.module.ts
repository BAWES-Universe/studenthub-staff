import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreViewPage } from './store-view.page';

const routes: Routes = [
  {
    path: ' ',
    component: StoreViewPage
  }, {
    path: ':id',
    component: StoreViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreViewPageRoutingModule {}
