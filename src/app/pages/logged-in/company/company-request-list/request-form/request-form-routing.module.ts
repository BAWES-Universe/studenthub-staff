import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestFormPage } from './request-form.page';

const routes: Routes = [
  {
    path: '',
    component: RequestFormPage
  }, {
    path: ':id',
    component: RequestFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestFormPageRoutingModule {}
