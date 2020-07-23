import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateListPage } from './candidate-list.page';

const routes: Routes = [
  {
    path: ':segment',
    component: CandidateListPage
  },{
    path: '',
    component: CandidateListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateListPageRoutingModule {}
