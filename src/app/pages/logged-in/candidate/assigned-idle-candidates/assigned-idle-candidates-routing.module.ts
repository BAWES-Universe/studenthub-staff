import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AssignedIdleCandidatesPage} from './assigned-idle-candidates.page';

const routes: Routes = [
  {
    path: ':segment',
    component: AssignedIdleCandidatesPage
  }, {
    path: '',
    component: AssignedIdleCandidatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignedIdleCandidatesPageRoutingModule {}
