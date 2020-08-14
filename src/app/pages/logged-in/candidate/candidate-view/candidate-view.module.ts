import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateViewPageRoutingModule } from './candidate-view-routing.module';

import { CandidateViewPage } from './candidate-view.page';
import {SelectSearchModule} from "src/app/components/select-search/select-search.module";
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CandidateViewPageRoutingModule,
        SelectSearchModule,
        LoadingModalModule
    ],
  declarations: [CandidateViewPage]
})
export class CandidateViewPageModule {}
