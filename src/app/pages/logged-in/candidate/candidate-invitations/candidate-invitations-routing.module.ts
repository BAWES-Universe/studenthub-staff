import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateInvitationsPage } from './candidate-invitations.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateInvitationsPage
  },
  {
    path: ':candidate_id',
    component: CandidateInvitationsPage
  },
  {
    path: ':candidate_id/:status',
    component: CandidateInvitationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateInvitationsPageRoutingModule {}
