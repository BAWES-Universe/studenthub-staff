import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryViewPage } from './country-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: CountryViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountryViewPageRoutingModule {}
