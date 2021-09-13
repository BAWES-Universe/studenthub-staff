import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CandidateUpdateEmailPage} from './candidate-update-email.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateUpdateEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateUpdateEmailPageRoutingModule {}
