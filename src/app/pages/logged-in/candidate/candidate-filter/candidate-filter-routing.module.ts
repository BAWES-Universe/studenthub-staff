import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateFilterPage } from './candidate-filter.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateFilterPageRoutingModule {}
