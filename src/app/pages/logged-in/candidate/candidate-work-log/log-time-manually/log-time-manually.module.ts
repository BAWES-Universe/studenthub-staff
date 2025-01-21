import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

//import { LogTimeManuallyPageRoutingModule } from './log-time-manually-routing.module';
//import { DateDropdownModule } from 'src/app/components/date-dropdown/date-dropdown.module';

import { LogTimeManuallyPage } from './log-time-manually.page';
import { TimePickerComponent } from '../../../../../components/time-picker/time-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerModule } from '../../../../../components/date-picker/date-picker.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DatePickerModule,
    TranslateModule.forChild(),
    //LogTimeManuallyPageRoutingModule
  ],
  declarations: [LogTimeManuallyPage, TimePickerComponent]
})
export class LogTimeManuallyPageModule {}
