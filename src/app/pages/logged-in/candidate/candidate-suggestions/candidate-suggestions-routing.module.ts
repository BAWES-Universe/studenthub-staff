import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateSuggestionsPage } from './candidate-suggestions.page';

const routes: Routes = [
  {
    path: ':candidate_id',
    component: CandidateSuggestionsPage
  },
  {
    path: ':candidate_id/:status',
    component: CandidateSuggestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateSuggestionsPageRoutingModule {}
