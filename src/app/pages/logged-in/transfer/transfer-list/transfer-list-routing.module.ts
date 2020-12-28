import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferListPage } from './transfer-list.page';

const routes: Routes = [
  {
    path: '',
    component: TransferListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferListPageRoutingModule {}
