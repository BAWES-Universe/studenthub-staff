import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateIdPageRoutingModule } from './generate-id-routing.module';

import { GenerateIdPage } from './generate-id.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import {NoItemsModule} from "../../../../components/no-items/no-items.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        GenerateIdPageRoutingModule,
        LoadingModalModule,
        NoItemsModule
    ],
  declarations: [GenerateIdPage]
})
export class GenerateIdPageModule {}
