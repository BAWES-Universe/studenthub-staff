import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateCommittedFormPage } from './candidate-committed-form.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateCommittedFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateCommittedFormPageRoutingModule {}
