import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateBankInfoListPage } from './candidate-bank-info-list.page';

const routes: Routes = [
  {
    path: ':segment',
    component: CandidateBankInfoListPage
  },{
    path: '',
    component: CandidateBankInfoListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateBankInfoListRoutingModule {}
