import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateAssignedHistoryPage } from './candidate-assigned-history.page';

const routes: Routes = [
  {
    path: ':segment',
    component: CandidateAssignedHistoryPage
  },{
    path: '',
    component: CandidateAssignedHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateAssignedHistoryPageRoutingModule {}
