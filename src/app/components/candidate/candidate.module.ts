import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateComponent } from './candidate.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RequestInterviewFormPageModule } from 'src/app/pages/logged-in/company/request-interview-form/request-interview-form.module';



@NgModule({
  declarations: [
    CandidateComponent
  ],
  imports: [ 
    CommonModule,
    PipesModule,
    IonicModule,
    RequestInterviewFormPageModule,
  ],
  exports: [
    CandidateComponent
  ]
})
export class CandidateModule { }
