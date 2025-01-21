import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobFormPage } from './job-form.page';

const routes: Routes = [
  {
    path: '',
    component: JobFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobFormPageRoutingModule {}
