import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveRequestFormPage } from './leave-request-form.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveRequestFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRequestFormPageRoutingModule {}
