import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MallOptionPage } from './mall-option.page';

const routes: Routes = [
  {
    path: '',
    component: MallOptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MallOptionPageRoutingModule {}
