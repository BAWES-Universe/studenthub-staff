import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppealViewPageRoutingModule } from './appeal-view-routing.module';

import { AppealViewPage } from './appeal-view.page';
import { WorkLogDayStatsModule } from 'src/app/components/work-log-day-stats/work-log-day-stats.module';
import { WorkLogModule } from 'src/app/components/work-log/work-log.module';
import { LogTimeManuallyPageModule } from '../log-time-manually/log-time-manually.module';
import { ContactAttemptPageModule } from '../contact-attempt/contact-attempt.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppealViewPageRoutingModule,
    WorkLogDayStatsModule,
    ContactAttemptPageModule,
    WorkLogModule,
    LogTimeManuallyPageModule
  ],
  declarations: [AppealViewPage]
})
export class AppealViewPageModule {}
