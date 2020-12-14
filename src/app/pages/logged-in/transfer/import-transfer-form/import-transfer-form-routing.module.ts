import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportTransferFormPage } from './import-transfer-form.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: ImportTransferFormPage
  },
  {
    path: ':company_id/:id',
    component: ImportTransferFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportTransferFormPageRoutingModule {}
