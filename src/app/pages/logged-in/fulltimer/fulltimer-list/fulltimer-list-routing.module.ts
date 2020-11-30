import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FulltimerListPage } from './fulltimer-list.page';

const routes: Routes = [
  {
    path: '',
    component: FulltimerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FulltimerListPageRoutingModule {}
