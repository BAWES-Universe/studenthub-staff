import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRequestsPage } from './company-requests.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanyRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRequestsPageRoutingModule {}
