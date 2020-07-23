import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpiredIdPage } from './expired-id.page';

const routes: Routes = [
  {
    path: '',
    component: ExpiredIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpiredIdPageRoutingModule {}
