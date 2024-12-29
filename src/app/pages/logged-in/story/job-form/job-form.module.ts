import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobFormPageRoutingModule } from './job-form-routing.module';

import { JobFormPage } from './job-form.page';
import { LocationPageModule } from '../../candidate/location/location.module';
import { TranslateModule } from '@ngx-translate/core';
import { DatePopupModule } from 'src/app/components/date-popup/date-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationPageModule,
    ReactiveFormsModule, 
    DatePopupModule,
    TranslateModule.forChild(),
    JobFormPageRoutingModule
  ],
  declarations: [JobFormPage]
})
export class JobFormPageModule {}
