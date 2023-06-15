import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferCandidateListPageRoutingModule } from './transfer-candidate-list-routing.module';

import { TransferCandidateListPage } from './transfer-candidate-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { DatePopupModule } from 'src/app/components/date-popup/date-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    NoItemsModule,
    TransferCandidateListPageRoutingModule,
    DatePopupModule
  ],
  declarations: [TransferCandidateListPage]
})
export class TransferCandidateListPageModule {}
