import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateIdRequestDetailPageRoutingModule } from './candidate-id-request-detail-routing.module';

import { CandidateIdRequestDetailPage } from './candidate-id-request-detail.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateIdRequestDetailPageRoutingModule,
    PipesModule,
    TranslateModule.forChild(),
    LoadingModalModule
  ],
  declarations: [CandidateIdRequestDetailPage]
})
export class CandidateIdRequestDetailPageModule {}
