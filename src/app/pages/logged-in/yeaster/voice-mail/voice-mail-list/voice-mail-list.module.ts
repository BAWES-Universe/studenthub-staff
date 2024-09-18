import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoiceMailListPageRoutingModule } from './voice-mail-list-routing.module';

import { VoiceMailListPage } from './voice-mail-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    VoiceMailListPageRoutingModule
  ],
  declarations: [VoiceMailListPage]
})
export class VoiceMailListPageModule {}
