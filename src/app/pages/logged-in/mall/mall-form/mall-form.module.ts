import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MallFormPageRoutingModule } from './mall-form-routing.module';

import { MallFormPage } from './mall-form.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MallFormPageRoutingModule
  ],
  declarations: [MallFormPage]
})
export class MallFormPageModule {}
