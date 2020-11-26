import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamViewPageRoutingModule } from './team-view-routing.module';

import { TeamViewPage } from './team-view.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamViewPageRoutingModule,
    NoItemsModule,
    LoadingModalModule
  ],
  declarations: [TeamViewPage]
})
export class TeamViewPageModule {}
