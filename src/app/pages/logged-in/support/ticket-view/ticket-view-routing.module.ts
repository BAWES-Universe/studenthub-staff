import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketViewPage } from './ticket-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: TicketViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketViewPageRoutingModule {}
