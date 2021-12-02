import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoryListPageRoutingModule } from './story-list-routing.module';

import { StoryListPage } from './story-list.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoryListPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [StoryListPage]
})
export class StoryListPageModule {}