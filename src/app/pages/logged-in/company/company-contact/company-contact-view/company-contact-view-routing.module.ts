import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyContactViewPage } from './company-contact-view.page';

const routes: Routes = [
  {
    path: ':contact_uuid',
    component: CompanyContactViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyContactViewPageRoutingModule {}
