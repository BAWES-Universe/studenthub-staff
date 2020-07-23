import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UniversityListPage } from './university-list.page';

const routes: Routes = [
  {
    path: '',
    component: UniversityListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniversityListPageRoutingModule {}
