import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllCompanyListPage } from './all-company-list.page';

const routes: Routes = [
  {
    path: '',
    component: AllCompanyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllCompanyListPageRoutingModule {}
