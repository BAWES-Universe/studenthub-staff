import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyContactsPage } from './company-contacts.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanyContactsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyContactsPageRoutingModule {}
