import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyContactRolePage } from './company-contact-role.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyContactRolePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyContactRolePageRoutingModule {}
