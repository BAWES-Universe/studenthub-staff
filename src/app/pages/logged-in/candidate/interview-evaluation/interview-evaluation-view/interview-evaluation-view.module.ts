import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewEvaluationViewPageRoutingModule } from './interview-evaluation-view-routing.module';

import { InterviewEvaluationViewPage } from './interview-evaluation-view.page';
import { InterviewEvaluationModule } from 'src/app/components/interview-evaluation/interview-evaluation.module';
import { NoteModule } from 'src/app/components/note/note.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteModule,
    InterviewEvaluationModule,
    InterviewEvaluationViewPageRoutingModule
  ],
  declarations: [InterviewEvaluationViewPage]
})
export class InterviewEvaluationViewPageModule {}
