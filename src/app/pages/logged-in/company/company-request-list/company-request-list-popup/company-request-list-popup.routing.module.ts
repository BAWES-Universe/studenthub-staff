import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRequestListPopupPage } from './company-request-list-popup.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyRequestListPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRequestListPopupPageRoutingModule {}
