import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateReviewListPage } from './candidate-review-list.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateReviewListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateReviewListPageRoutingModule {}
