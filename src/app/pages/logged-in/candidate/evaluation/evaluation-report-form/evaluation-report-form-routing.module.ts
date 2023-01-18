import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationReportFormPage } from './evaluation-report-form.page';

const routes: Routes = [
  {
    path: ':candidateID',
    component: EvaluationReportFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationReportFormPageRoutingModule {}
