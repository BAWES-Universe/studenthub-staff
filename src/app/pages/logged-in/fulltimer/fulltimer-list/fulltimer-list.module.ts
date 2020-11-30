import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulltimerListPageRoutingModule } from './fulltimer-list-routing.module';

import { FulltimerListPage } from './fulltimer-list.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FulltimerListPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [FulltimerListPage]
})
export class FulltimerListPageModule {}
