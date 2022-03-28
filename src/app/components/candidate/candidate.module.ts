import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateComponent } from './candidate.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [
    CandidateComponent
  ],
  imports: [ 
    CommonModule,
    PipesModule,
    IonicModule
  ],
  exports: [
    CandidateComponent
  ]
})
export class CandidateModule { }
