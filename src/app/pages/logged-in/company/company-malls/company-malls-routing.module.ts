import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyMallsPage } from './company-malls.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanyMallsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyMallsPageRoutingModule {}
