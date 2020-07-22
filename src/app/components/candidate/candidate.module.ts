import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateComponent } from './candidate.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    CandidateComponent
  ],
  imports: [ 
    CommonModule,
    IonicModule
  ],
  exports: [
    CandidateComponent
  ]
})
export class CandidateModule { }
