import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateWarningFormPageRoutingModule } from './candidate-warning-form-routing.module';

import { CandidateWarningFormPage } from './candidate-warning-form.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoadingModalModule,
    ReactiveFormsModule,
    IonicModule,
    CandidateWarningFormPageRoutingModule
  ],
  declarations: [CandidateWarningFormPage]
})
export class CandidateWarningFormPageModule {}
