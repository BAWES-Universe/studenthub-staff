import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestPageRoutingModule } from './suggest-routing.module';

import { SuggestPage } from './suggest.page';

import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RequestListingModule,
    SuggestPageRoutingModule
  ],
  declarations: [SuggestPage]
})
export class SuggestPageModule {}
