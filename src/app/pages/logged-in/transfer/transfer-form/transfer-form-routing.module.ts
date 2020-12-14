import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferFormPage } from './transfer-form.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: TransferFormPage
  },{
    path: ':company_id/:id',
    component: TransferFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferFormPageRoutingModule {}
