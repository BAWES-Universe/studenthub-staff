import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateAssignFormPage } from './candidate-assign-form.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateAssignFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateAssignFormPageRoutingModule {}
