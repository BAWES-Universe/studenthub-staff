import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValocityPageRoutingModule } from './valocity-routing.module';

import { ValocityPage } from './valocity.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {DatePopupModule} from "../../../../components/date-popup/date-popup.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ValocityPageRoutingModule,
        LoadingModalModule,
        DatePopupModule
    ],
  declarations: [ValocityPage]
})
export class ValocityPageModule {}
