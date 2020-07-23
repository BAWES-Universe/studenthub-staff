import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryListPage } from './country-list.page';

const routes: Routes = [
  {
    path: '',
    component: CountryListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountryListPageRoutingModule {}
