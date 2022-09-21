import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { LogDateListPageRoutingModule } from './log-date-list-routing.module';

import { LogDateListPage } from './log-date-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {PipesModule} from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    PipesModule,
    LogDateListPageRoutingModule
  ],
  declarations: [
    LogDateListPage
  ]
})
export class LogDateListPageModule {}
