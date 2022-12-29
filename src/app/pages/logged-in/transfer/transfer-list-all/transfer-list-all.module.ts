import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferListAllPageRoutingModule } from './transfer-list-all-routing.module';

import { TransferListAllPage } from './transfer-list-all.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import {NoItemsModule} from 'src/app/components/no-items/no-items.module';
import {DatePopupModule} from "../../../../components/date-popup/date-popup.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoadingModalModule,
        NoItemsModule,
        TransferListAllPageRoutingModule,
        DatePopupModule
    ],
  declarations: [TransferListAllPage]
})
export class TransferListAllPageModule {}
