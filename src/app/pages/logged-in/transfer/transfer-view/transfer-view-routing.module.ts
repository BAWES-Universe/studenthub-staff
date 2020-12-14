import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferViewPage } from './transfer-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: TransferViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferViewPageRoutingModule {}
