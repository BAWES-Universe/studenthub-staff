import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MallOptionPageRoutingModule } from './mall-option-routing.module';

import { MallOptionPage } from './mall-option.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MallOptionPageRoutingModule
  ],
  declarations: [MallOptionPage]
})
export class MallOptionPageModule {}
