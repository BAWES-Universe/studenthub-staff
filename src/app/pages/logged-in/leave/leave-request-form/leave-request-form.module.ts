import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveRequestFormPageRoutingModule } from './leave-request-form-routing.module';

import { LeaveRequestFormPage } from './leave-request-form.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    LeaveRequestFormPageRoutingModule,
    IonicModule
  ],
  declarations: [LeaveRequestFormPage]
})
export class LeaveRequestFormPageModule {}
