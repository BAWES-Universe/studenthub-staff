import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValocityPageRoutingModule } from './valocity-routing.module';

import { ValocityPage } from './valocity.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValocityPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [ValocityPage]
})
export class ValocityPageModule {}
