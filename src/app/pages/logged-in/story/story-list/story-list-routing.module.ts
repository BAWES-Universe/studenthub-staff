import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoryListPage } from './story-list.page';

const routes: Routes = [
  {
    path: '',
    component: StoryListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoryListPageRoutingModule {}
