import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandViewPage } from './brand-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: BrandViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandViewPageRoutingModule {}
