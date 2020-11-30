import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulltimerLocationPageRoutingModule } from './fulltimer-location-routing.module';

import { FulltimerLocationPage } from './fulltimer-location.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    FulltimerLocationPageRoutingModule
  ],
  declarations: [FulltimerLocationPage]
})
export class FulltimerLocationPageModule {}
