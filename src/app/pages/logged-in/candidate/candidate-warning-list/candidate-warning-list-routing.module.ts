import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateWarningsPage } from './candidate-warning-list.page';

const routes: Routes = [
  {
    path: ':candidate_id',
    component: CandidateWarningsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateWarningsPageRoutingModule {}
