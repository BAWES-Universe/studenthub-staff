import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewEvaluationViewPage } from './interview-evaluation-view.page';

const routes: Routes = [
  {
    path: ':interview_evaluation_uuid',
    component: InterviewEvaluationViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewEvaluationViewPageRoutingModule {}
