import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRequestFormPage } from './company-request-form.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyRequestFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRequestFormPageRoutingModule {}
