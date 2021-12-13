import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvitationListPage } from './invitation-list.page';

const routes: Routes = [
  {
    path: '',
    component: InvitationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitationListPageRoutingModule {}
