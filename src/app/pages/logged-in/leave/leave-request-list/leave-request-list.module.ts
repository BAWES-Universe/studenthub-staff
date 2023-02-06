import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveRequestListPageRoutingModule } from './leave-request-list-routing.module';

import { LeaveRequestListPage } from './leave-request-list.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveRequestListPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [LeaveRequestListPage]
})
export class LeaveRequestListPageModule {}
