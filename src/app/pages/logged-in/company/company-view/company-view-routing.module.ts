import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyViewPage } from './company-view.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanyViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyViewPageRoutingModule {}
