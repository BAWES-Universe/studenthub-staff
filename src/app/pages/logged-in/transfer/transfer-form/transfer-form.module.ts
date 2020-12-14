import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferFormPageRoutingModule } from './transfer-form-routing.module';

import { TransferFormPage } from './transfer-form.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DateDropdownModule } from 'src/app/components/date-dropdown/date-dropdown.module';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    TransferFormPageRoutingModule,
    PipesModule,
    DateDropdownModule,
    CalendarModule
  ],
  exports: [
    PipesModule
  ],
  declarations: [TransferFormPage]
})
export class TransferFormPageModule {}
