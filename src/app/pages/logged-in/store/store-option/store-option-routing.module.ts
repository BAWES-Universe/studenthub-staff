import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreOptionPage } from './store-option.page';

const routes: Routes = [
  {
    path: '',
    component: StoreOptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreOptionPageRoutingModule {}
