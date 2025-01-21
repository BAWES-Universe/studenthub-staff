import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppealViewPage } from './appeal-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: AppealViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppealViewPageRoutingModule {}
