import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamViewPageRoutingModule } from './team-view-routing.module';

import { TeamViewPage } from './team-view.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { NoteModule } from 'src/app/components/note/note.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NoteModule,
    IonicModule,
    TeamViewPageRoutingModule,
    NoItemsModule,
    LoadingModalModule
  ],
  declarations: [TeamViewPage]
})
export class TeamViewPageModule {}
