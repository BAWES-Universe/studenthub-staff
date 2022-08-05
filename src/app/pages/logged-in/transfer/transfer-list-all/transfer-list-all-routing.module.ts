import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferListAllPage } from './transfer-list-all.page';

const routes: Routes = [
  {
    path: '',
    component: TransferListAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferListAllPageRoutingModule {}
