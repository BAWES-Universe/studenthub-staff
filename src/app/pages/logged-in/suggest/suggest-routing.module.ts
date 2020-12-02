import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuggestPage } from './suggest.page';

const routes: Routes = [
  {
    path: '',
    component: SuggestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestPageRoutingModule {}
