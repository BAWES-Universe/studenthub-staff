import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreManagerFormPageRoutingModule } from './store-manager-form-routing.module';

import { StoreManagerFormPage } from './store-manager-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreManagerFormPageRoutingModule
  ],
  declarations: [StoreManagerFormPage]
})
export class StoreManagerFormPageModule {}
