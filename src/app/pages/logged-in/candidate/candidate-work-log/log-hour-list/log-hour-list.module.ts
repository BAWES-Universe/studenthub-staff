import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { LogHourListPageRoutingModule } from './log-hour-list-routing.module';

import { LogHourListPage } from './log-hour-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {PipesModule} from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    PipesModule,
    LogHourListPageRoutingModule
  ],
  declarations: [
    LogHourListPage
  ]
})
export class LogHourListPageModule {}
