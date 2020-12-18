import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateNotesPage } from './candidate-notes.page';

const routes: Routes = [
  {
    path: ':candidate_id',
    component: CandidateNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateNotesPageRoutingModule {}
