import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyContactListPage } from './company-contact-list.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyContactListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyContactListPageRoutingModule {}
