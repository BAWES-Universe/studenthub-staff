import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyBrandsPage } from './company-brands.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanyBrandsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyBrandsPageRoutingModule {}
