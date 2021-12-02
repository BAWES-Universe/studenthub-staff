import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackBacklogPage } from './feedback-backlog.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackBacklogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackBacklogPageRoutingModule {}
