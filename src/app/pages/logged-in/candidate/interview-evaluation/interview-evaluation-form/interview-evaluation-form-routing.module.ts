import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewEvaluationFormPage } from './interview-evaluation-form.page';

const routes: Routes = [
  {
    path: '',
    component: InterviewEvaluationFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewEvaluationFormPageRoutingModule {}
