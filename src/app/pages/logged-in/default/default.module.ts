import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefaultPageRoutingModule } from './default-routing.module';

import { DefaultPage } from './default.page';
import {LoadingModalModule} from "../../../components/loading-modal/loading-modal.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DefaultPageRoutingModule,
        LoadingModalModule
    ],
  declarations: [DefaultPage]
})
export class DefaultPageModule {}
