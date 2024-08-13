import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateCertificateFormPage } from './candidate-certificate-form.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateCertificateFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateCertificateFormPageRoutingModule {}
