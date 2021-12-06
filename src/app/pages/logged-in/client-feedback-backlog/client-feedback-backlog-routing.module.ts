import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientFeedbackBacklogPage } from './client-feedback-backlog.page';

const routes: Routes = [
  {
    path: '',
    component: ClientFeedbackBacklogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientFeedbackBacklogPageRoutingModule {}
