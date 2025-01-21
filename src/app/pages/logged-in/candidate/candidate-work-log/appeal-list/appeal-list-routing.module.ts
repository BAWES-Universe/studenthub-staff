import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppealListPage } from './appeal-list.page';

const routes: Routes = [
  {
    path: '',
    component: AppealListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppealListPageRoutingModule {}
