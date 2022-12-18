import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveRequestPageRoutingModule } from './leave-request-routing.module';

import { LeaveRequestPage } from './leave-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LeaveRequestPageRoutingModule
  ],
  declarations: [LeaveRequestPage]
})
export class LeaveRequestPageModule {}
