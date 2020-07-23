import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpiredIdPageRoutingModule } from './expired-id-routing.module';

import { ExpiredIdPage } from './expired-id.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import {NoItemsModule} from "../../../../components/no-items/no-items.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ExpiredIdPageRoutingModule,
        LoadingModalModule,
        NoItemsModule
    ],
  declarations: [ExpiredIdPage]
})
export class ExpiredIdPageModule {}
