import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluationReportListPageRoutingModule } from './evaluation-report-list-routing.module';

import { EvaluationReportListPage } from './evaluation-report-list.page';
import {NoItemsModule} from "../../../../../components/no-items/no-items.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EvaluationReportListPageRoutingModule,
        NoItemsModule
    ],
  declarations: [EvaluationReportListPage]
})
export class EvaluationReportListPageModule {}
