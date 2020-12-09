import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuggestionViewPage } from './suggestion-view.page';

const routes: Routes = [
  {
    path: ':suggestion_uuid',
    component: SuggestionViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestionViewPageRoutingModule {}
