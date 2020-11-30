import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FulltimerFormPage } from './fulltimer-form.page';

const routes: Routes = [
  {
    path: '',
    component: FulltimerFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FulltimerFormPageRoutingModule {}
