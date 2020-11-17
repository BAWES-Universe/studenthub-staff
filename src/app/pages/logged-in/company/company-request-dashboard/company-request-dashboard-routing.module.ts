import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRequestDashboardPage } from './company-request-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyRequestDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRequestDashboardPageRoutingModule {}
