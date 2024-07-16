import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewEvaluationListPageRoutingModule } from './interview-evaluation-list-routing.module';

import { InterviewEvaluationListPage } from './interview-evaluation-list.page';
import { InterviewEvaluationModule } from 'src/app/components/interview-evaluation/interview-evaluation.module';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { InterviewEvaluationFormPageModule } from '../interview-evaluation-form/interview-evaluation-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    InterviewEvaluationModule,
    InterviewEvaluationFormPageModule,
    InterviewEvaluationListPageRoutingModule
  ],
  declarations: [InterviewEvaluationListPage]
})
export class InterviewEvaluationListPageModule {}
