import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CronLogPage } from './cron-log.page';

const routes: Routes = [
  {
    path: '',
    component: CronLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CronLogPageRoutingModule {}
