import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyDocumentsPage } from './company-documents.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanyDocumentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyDocumentsPageRoutingModule {}
