import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateAssignedHistoryPageRoutingModule } from './candidate-assigned-history-routing.module';

import { CandidateAssignedHistoryPage } from './candidate-assigned-history.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import {NoItemsModule} from "../../../../components/no-items/no-items.module";
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PipesModule,
        IonicModule,
        CandidateModule,
        CandidateAssignedHistoryPageRoutingModule,
        LoadingModalModule,
        NoItemsModule
    ],
  declarations: [CandidateAssignedHistoryPage]
})
export class CandidateAssignedHistoryPageModule {}
