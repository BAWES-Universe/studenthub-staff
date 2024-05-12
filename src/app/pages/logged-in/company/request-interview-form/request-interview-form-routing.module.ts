import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestInterviewFormPage } from './request-interview-form.page';

const routes: Routes = [
  {
    path: '',
    component: RequestInterviewFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestInterviewFormPageRoutingModule {}
