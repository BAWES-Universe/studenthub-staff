import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestInterviewListPageRoutingModule } from './request-interview-list-routing.module';

import { RequestInterviewListPage } from './request-interview-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { DatePopupModule } from 'src/app/components/date-popup/date-popup.module';
import { RequestInterviewFilterPage } from '../request-interview-filter/request-interview-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    NoItemsModule,
    CandidateModule,
    DatePopupModule,
    TranslateModule.forChild(),
    RequestInterviewListPageRoutingModule
  ],
  declarations: [
    RequestInterviewFilterPage,
    RequestInterviewListPage
  ]
})
export class RequestInterviewListPageModule {}
