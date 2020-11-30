import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulltimerFormPageRoutingModule } from './fulltimer-form-routing.module';

import { FulltimerFormPage } from './fulltimer-form.page';
import { SelectSearchModule } from 'src/app/components/select-search/select-search.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SelectSearchModule,
    FulltimerFormPageRoutingModule
  ],
  declarations: [FulltimerFormPage]
})
export class FulltimerFormPageModule {}
