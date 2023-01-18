import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationReportViewPage } from './evaluation-report-view.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluationReportViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationReportViewPageRoutingModule {}
