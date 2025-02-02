import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginTwoStepPage } from './login-two-step.page';

const routes: Routes = [
  {
    path: ':token',
    component: LoginTwoStepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginTwoStepPageRoutingModule {}
