import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateSearchPage } from './candidate-search.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateSearchPageRoutingModule {}
