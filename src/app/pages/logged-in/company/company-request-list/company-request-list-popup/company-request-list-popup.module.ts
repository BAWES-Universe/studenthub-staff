import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestListPopupPageRoutingModule } from './company-request-list-popup.routing.module';

import { CompanyRequestListPopupPage } from './company-request-list-popup.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { DateDropdownModule } from 'src/app/components/date-dropdown/date-dropdown.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    PipesModule, 
    RequestListingModule,
    DateDropdownModule,
    CompanyRequestListPopupPageRoutingModule
  ],
  declarations: [CompanyRequestListPopupPage]
})
export class CompanyRequestListPopupPageModule {}
