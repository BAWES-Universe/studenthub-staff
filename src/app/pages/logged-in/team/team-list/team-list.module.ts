import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamListPageRoutingModule } from './team-list-routing.module';

import { TeamListPage } from './team-list.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamListPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [TeamListPage]
})
export class TeamListPageModule {}
