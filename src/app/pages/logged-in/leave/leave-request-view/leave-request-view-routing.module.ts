import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveRequestViewPage } from './leave-request-view.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveRequestViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRequestViewPageRoutingModule {}
