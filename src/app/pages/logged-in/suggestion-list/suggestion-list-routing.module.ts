import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuggestionListPage } from './suggestion-list.page';

const routes: Routes = [
  {
    path: '',
    component: SuggestionListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestionListPageRoutingModule {}
