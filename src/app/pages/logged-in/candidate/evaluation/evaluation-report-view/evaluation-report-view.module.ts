import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationReportViewPageRoutingModule } from './evaluation-report-view-routing.module';

import { EvaluationReportViewPage } from './evaluation-report-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationReportViewPageRoutingModule
  ],
  declarations: [EvaluationReportViewPage]
})
export class EvaluationReportViewPageModule {}
