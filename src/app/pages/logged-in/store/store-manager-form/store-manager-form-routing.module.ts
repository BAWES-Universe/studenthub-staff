import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreManagerFormPage } from './store-manager-form.page';

const routes: Routes = [
  {
    path: '',
    component: StoreManagerFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreManagerFormPageRoutingModule {}
