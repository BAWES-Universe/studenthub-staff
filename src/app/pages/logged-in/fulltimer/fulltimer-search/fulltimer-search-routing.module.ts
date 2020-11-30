import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FulltimerSearchPage } from './fulltimer-search.page';

const routes: Routes = [
  {
    path: '',
    component: FulltimerSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FulltimerSearchPageRoutingModule {}
