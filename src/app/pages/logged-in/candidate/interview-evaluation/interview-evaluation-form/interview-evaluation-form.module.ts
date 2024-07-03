import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewEvaluationFormPageRoutingModule } from './interview-evaluation-form-routing.module';

import { InterviewEvaluationFormPage } from './interview-evaluation-form.page';
import { CompanyRequestListPopupPageModule } from '../../../company/company-request-list/company-request-list-popup/company-request-list-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CompanyRequestListPopupPageModule,
    InterviewEvaluationFormPageRoutingModule
  ],
  declarations: [InterviewEvaluationFormPage]
})
export class InterviewEvaluationFormPageModule {}
