import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyFollowupListPage } from './company-followup-list.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyFollowupListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyFollowupListPageRoutingModule {}
