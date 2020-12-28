import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyNavPage } from './company-nav.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyNavPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyNavPageRoutingModule {}
