import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValocityPage } from './valocity.page';

const routes: Routes = [
  {
    path: '',
    component: ValocityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValocityPageRoutingModule {}
