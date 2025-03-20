import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CronLogPageRoutingModule } from './cron-log-routing.module';

import { CronLogPage } from './cron-log.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CronLogPageRoutingModule,
    LoadingModalModule,
  ],
  declarations: [CronLogPage]
})
export class CronLogPageModule {}
