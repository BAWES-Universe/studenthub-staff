import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidatePage } from './candidate.page';

const routes: Routes = [
  {
    path: '',
    component: CandidatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatePageRoutingModule {}
