import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateNoteFormPage } from './candidate-note-form.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateNoteFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateNoteFormPageRoutingModule {}
