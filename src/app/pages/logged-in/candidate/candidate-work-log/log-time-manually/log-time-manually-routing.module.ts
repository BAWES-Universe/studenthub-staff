import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogTimeManuallyPage } from './log-time-manually.page';

const routes: Routes = [
  {
    path: '',
    component: LogTimeManuallyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogTimeManuallyPageRoutingModule {}
