import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoiceMailViewPageRoutingModule } from './voice-mail-view-routing.module';

import { VoiceMailViewPage } from './voice-mail-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoiceMailViewPageRoutingModule
  ],
  declarations: [VoiceMailViewPage]
})
export class VoiceMailViewPageModule {}
