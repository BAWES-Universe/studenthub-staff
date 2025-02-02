import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginTwoStepPageRoutingModule } from './login-two-step-routing.module';

import { LoginTwoStepPage } from './login-two-step.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginTwoStepPageRoutingModule
  ],
  declarations: [LoginTwoStepPage]
})
export class LoginTwoStepPageModule {}
