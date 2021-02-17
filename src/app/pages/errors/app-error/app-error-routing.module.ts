import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppErrorPage } from './app-error.page';

const routes: Routes = [
  {
    path: '',
    component: AppErrorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppErrorPageRoutingModule {}
