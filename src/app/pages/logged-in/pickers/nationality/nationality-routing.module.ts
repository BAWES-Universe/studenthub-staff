import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NationalityPage } from './nationality.page';

const routes: Routes = [
  {
    path: '',
    component: NationalityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NationalityPageRoutingModule {}
