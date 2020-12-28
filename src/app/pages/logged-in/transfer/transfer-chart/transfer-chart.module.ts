import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferChartPageRoutingModule } from './transfer-chart-routing.module';

import { TransferChartPage } from './transfer-chart.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    NoItemsModule,
    TransferChartPageRoutingModule
  ],
  declarations: [TransferChartPage]
})
export class TransferChartPageModule {}
