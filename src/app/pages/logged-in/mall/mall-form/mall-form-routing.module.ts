import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MallFormPage } from './mall-form.page';

const routes: Routes = [
  {
    path: '',
    component: MallFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MallFormPageRoutingModule {}
