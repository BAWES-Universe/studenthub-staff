import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyStoresPage } from './company-stores.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanyStoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyStoresPageRoutingModule {}
