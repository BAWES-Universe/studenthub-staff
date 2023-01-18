import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationReportFormPageRoutingModule } from './evaluation-report-form-routing.module';

import { EvaluationReportFormPage } from './evaluation-report-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationReportFormPageRoutingModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [EvaluationReportFormPage]
})
export class EvaluationReportFormPageModule {}
