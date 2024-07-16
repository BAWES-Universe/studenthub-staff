import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewEvaluationListPage } from './interview-evaluation-list.page';

const routes: Routes = [
  {
    path: ':candidate_id',
    component: InterviewEvaluationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewEvaluationListPageRoutingModule {}
