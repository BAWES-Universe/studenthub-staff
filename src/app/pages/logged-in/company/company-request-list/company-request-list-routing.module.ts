import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRequestListPage } from './company-request-list.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyRequestListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRequestListPageRoutingModule {}
