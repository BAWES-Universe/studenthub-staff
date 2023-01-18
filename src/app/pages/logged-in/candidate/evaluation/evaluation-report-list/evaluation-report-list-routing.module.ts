import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluationReportListPage } from './evaluation-report-list.page';

const routes: Routes = [
  {
    path: ':candidateID',
    component: EvaluationReportListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationReportListPageRoutingModule {}
