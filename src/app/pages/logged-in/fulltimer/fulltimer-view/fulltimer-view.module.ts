import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulltimerViewPageRoutingModule } from './fulltimer-view-routing.module';

import { FulltimerViewPage } from './fulltimer-view.page';

import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FulltimerViewPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [FulltimerViewPage]
})
export class FulltimerViewPageModule { }
