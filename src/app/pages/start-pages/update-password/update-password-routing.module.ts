import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePasswordPage } from './update-password.page';

const routes: Routes = [
  {
    path: ':token',
    component: UpdatePasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePasswordPageRoutingModule {}
