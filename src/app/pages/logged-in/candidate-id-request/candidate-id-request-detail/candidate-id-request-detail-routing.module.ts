import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateIdRequestDetailPage } from './candidate-id-request-detail.page';

const routes: Routes = [
  {
    path: ':id',
    component: CandidateIdRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateIdRequestDetailPageRoutingModule {}
