import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateBankInfoListRoutingModule } from './candidate-bank-info-list-routing.module';

import { CandidateBankInfoListPage } from './candidate-bank-info-list.page';
import {LoadingModalModule} from '../../../../components/loading-modal/loading-modal.module';
import {NoItemsModule} from '../../../../components/no-items/no-items.module';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CandidateModule,
        CandidateBankInfoListRoutingModule,
        LoadingModalModule,
        NoItemsModule
    ],
  declarations: [CandidateBankInfoListPage]
})
export class CandidateBankInfoListModule {}
