import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferRatesPageRoutingModule } from './transfer-rates-routing.module';

import { TransferRatesPage } from './transfer-rates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferRatesPageRoutingModule
  ],
  declarations: [TransferRatesPage]
})
export class TransferRatesPageModule {}
