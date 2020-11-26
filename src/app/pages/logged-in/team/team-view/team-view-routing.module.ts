import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamViewPage } from './team-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: TeamViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamViewPageRoutingModule {}
