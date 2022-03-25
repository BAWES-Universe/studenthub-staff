import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyFilterPage } from './company-filter.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyFilterPageRoutingModule {}
