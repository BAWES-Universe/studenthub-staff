import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateAccountPage } from './update-account.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateAccountPageRoutingModule {}
