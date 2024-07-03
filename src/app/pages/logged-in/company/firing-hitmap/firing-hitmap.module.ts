import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiringHitmapPageRoutingModule } from './firing-hitmap-routing.module';

import { FiringHitmapPage } from './firing-hitmap.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    FiringHitmapPageRoutingModule
  ],
  declarations: [FiringHitmapPage]
})
export class FiringHitmapPageModule {}
