import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppealListPageRoutingModule } from './appeal-list-routing.module';

import { AppealListPage } from './appeal-list.page';
import { AppealFilterComponent } from 'src/app/components/appeal-filter/appeal-filter.component';
import { DatePopupModule } from 'src/app/components/date-popup/date-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppealListPageRoutingModule,
    DatePopupModule
  ],
  declarations: [AppealListPage, AppealFilterComponent]
})
export class AppealListPageModule {}
