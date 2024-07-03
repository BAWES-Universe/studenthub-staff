import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PipesModule} from 'src/app/pipes/pipes.module';
import { InterviewEvaluationComponent } from './interview-evaluation.component';


@NgModule({
  declarations: [
    InterviewEvaluationComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
  ],
  exports: [
    InterviewEvaluationComponent
  ]
})
export class InterviewEvaluationModule {
}

