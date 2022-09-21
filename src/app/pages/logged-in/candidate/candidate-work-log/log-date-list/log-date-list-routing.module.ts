import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogDateListPage } from './log-date-list.page';

const routes: Routes = [
  {
    path: '',
    component: LogDateListPage
  },
  {
    path: ':candidate_id',
    component: LogDateListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogDateListPageRoutingModule {}
