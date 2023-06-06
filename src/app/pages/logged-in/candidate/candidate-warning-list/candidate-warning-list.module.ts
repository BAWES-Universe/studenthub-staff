import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateWarningsPageRoutingModule } from './candidate-warning-list-routing.module';

import { CandidateWarningsPage } from './candidate-warning-list.page';

import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoadingModalModule,
    IonicModule,
    PipesModule,
    CandidateWarningsPageRoutingModule
  ],
  declarations: [
    CandidateWarningsPage
  ]
})
export class CandidateWarningListPageModule {}
