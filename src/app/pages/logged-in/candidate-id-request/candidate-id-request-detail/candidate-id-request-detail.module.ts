import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateIdRequestDetailPageRoutingModule } from './candidate-id-request-detail-routing.module';

import { CandidateIdRequestDetailPage } from './candidate-id-request-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateIdRequestDetailPageRoutingModule
  ],
  declarations: [CandidateIdRequestDetailPage]
})
export class CandidateIdRequestDetailPageModule {}
