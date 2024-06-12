import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatePageRoutingModule } from './candidate-routing.module';

import { CandidatePage } from './candidate.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    TranslateModule.forChild(),
    CandidatePageRoutingModule
  ],
  declarations: [CandidatePage]
})
export class CandidatePageModule {}
