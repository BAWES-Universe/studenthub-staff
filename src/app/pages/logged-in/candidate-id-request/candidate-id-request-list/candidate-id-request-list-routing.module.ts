import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateIdRequestListPage } from './candidate-id-request-list.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateIdRequestListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateIdRequestListPageRoutingModule {}
