import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferRatesPage } from './transfer-rates.page';

const routes: Routes = [
  {
    path: '',
    component: TransferRatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferRatesPageRoutingModule {}
