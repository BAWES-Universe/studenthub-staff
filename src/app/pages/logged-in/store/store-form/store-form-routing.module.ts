import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreFormPage } from './store-form.page';

const routes: Routes = [
  {
    path: '',
    component: StoreFormPage
  },
  {
    path: ':id',
    component: StoreFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreFormPageRoutingModule {}
