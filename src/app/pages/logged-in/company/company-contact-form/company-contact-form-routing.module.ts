import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyContactFormPage } from './company-contact-form.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyContactFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyContactFormPageRoutingModule {}
