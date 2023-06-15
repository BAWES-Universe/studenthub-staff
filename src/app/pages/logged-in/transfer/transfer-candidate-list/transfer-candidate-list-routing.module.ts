import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferCandidateListPage } from './transfer-candidate-list.page';

const routes: Routes = [
  {
    path: '',
    component: TransferCandidateListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferCandidateListPageRoutingModule {}
