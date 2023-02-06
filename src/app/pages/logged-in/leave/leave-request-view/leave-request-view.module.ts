import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveRequestViewPageRoutingModule } from './leave-request-view-routing.module';

import { LeaveRequestViewPage } from './leave-request-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveRequestViewPageRoutingModule
  ],
  declarations: [LeaveRequestViewPage]
})
export class LeaveRequestViewPageModule {}
