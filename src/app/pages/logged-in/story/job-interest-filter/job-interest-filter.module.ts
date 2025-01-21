import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

//import { JobInterestFilterPageRoutingModule } from './job-interest-filter-routing.module';

import { JobInterestFilterPage } from './job-interest-filter.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    IonicModule,
    //JobInterestFilterPageRoutingModule
  ],
  declarations: [JobInterestFilterPage]
})
export class JobInterestFilterPageModule {}
