import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveRequestListPage } from './leave-request-list.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveRequestListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRequestListPageRoutingModule {}
