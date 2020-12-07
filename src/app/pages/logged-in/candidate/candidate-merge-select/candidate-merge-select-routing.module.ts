import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateMergeSelectPage } from './candidate-merge-select.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateMergeSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateMergeSelectPageRoutingModule {}
