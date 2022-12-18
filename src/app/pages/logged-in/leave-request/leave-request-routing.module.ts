import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveRequestPage } from './leave-request.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRequestPageRoutingModule {}
