import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferChartPage } from './transfer-chart.page';

const routes: Routes = [
  {
    path: '',
    component: TransferChartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferChartPageRoutingModule {}
