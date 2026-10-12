import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationUnsavedGuard, InterviewEvaluationViewPage } from './interview-evaluation-view.page';

const routes: Routes = [
  {
    path: ':interview_evaluation_uuid',
    component: InterviewEvaluationViewPage,
    canDeactivate: [EvaluationUnsavedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewEvaluationViewPageRoutingModule {}
