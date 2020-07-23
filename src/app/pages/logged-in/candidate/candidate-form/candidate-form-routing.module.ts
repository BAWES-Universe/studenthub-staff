import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateFormPage } from './candidate-form.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateFormPage
  },
  {
    path: ':id',
    component: CandidateFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateFormPageRoutingModule {}
