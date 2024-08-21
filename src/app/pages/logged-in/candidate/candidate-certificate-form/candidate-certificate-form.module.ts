import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateCertificateFormPageRoutingModule } from './candidate-certificate-form-routing.module';

import { CandidateCertificateFormPage } from './candidate-certificate-form.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    //CandidateCertificateFormPageRoutingModule
  ],
  declarations: [CandidateCertificateFormPage]
})
export class CandidateCertificateFormPageModule {}
