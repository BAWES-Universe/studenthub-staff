import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactAttemptPage } from './contact-attempt.page';

const routes: Routes = [
  {
    path: '',
    component: ContactAttemptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactAttemptPageRoutingModule {}
