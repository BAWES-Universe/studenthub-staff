import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreOptionPageRoutingModule } from './store-option-routing.module';

import { StoreOptionPage } from './store-option.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreOptionPageRoutingModule
  ],
  declarations: [StoreOptionPage]
})
export class StoreOptionPageModule {}
