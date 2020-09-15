import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyListPage } from './company-list.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyListPageRoutingModule {}
