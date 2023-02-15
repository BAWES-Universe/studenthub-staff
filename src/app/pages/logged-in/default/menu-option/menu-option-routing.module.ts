import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuOptionPage } from './menu-option.page';

const routes: Routes = [
  {
    path: '',
    component: MenuOptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuOptionPageRoutingModule {}
