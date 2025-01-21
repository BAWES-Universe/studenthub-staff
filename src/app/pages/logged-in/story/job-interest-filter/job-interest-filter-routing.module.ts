import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobInterestFilterPage } from './job-interest-filter.page';

const routes: Routes = [
  {
    path: '',
    component: JobInterestFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobInterestFilterPageRoutingModule {}
