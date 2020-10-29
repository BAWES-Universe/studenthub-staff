import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignedExpiredCivilPage } from './assigned-expired-civil.page';

const routes: Routes = [
  {
    path: '',
    component: AssignedExpiredCivilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignedExpiredCivilPageRoutingModule {}
