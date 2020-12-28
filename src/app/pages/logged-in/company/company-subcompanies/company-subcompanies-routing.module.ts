import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanySubcompaniesPage } from './company-subcompanies.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanySubcompaniesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanySubcompaniesPageRoutingModule {}
