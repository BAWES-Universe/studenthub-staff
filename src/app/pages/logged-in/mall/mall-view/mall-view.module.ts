import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MallViewPageRoutingModule } from './mall-view-routing.module';

import { MallViewPage } from './mall-view.page';
import {CandidateModule} from "../../../../components/candidate/candidate.module";
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MallViewPageRoutingModule,
    CandidateModule,
    LoadingModalModule
  ],
  declarations: [MallViewPage]
})
export class MallViewPageModule {}
