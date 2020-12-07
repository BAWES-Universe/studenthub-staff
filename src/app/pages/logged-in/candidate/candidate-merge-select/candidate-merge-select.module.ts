import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateMergeSelectPageRoutingModule } from './candidate-merge-select-routing.module';

import { CandidateMergeSelectPage } from './candidate-merge-select.page';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateModule,
    CandidateMergeSelectPageRoutingModule
  ],
  declarations: [CandidateMergeSelectPage]
})
export class CandidateMergeSelectPageModule {}
