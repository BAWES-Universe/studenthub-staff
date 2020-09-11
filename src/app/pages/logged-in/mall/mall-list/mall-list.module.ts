import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MallListPageRoutingModule } from './mall-list-routing.module';

import { MallListPage } from './mall-list.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MallListPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [MallListPage]
})
export class MallListPageModule {}
