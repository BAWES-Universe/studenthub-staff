import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NationalityPageRoutingModule } from './nationality-routing.module';

import { NationalityPage } from './nationality.page';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    TranslateModule.forChild(),
    NationalityPageRoutingModule
  ],
  declarations: [NationalityPage]
})
export class NationalityPageModule {}
