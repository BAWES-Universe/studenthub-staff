import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyContactsPageRoutingModule } from './company-contacts-routing.module';

import { CompanyContactsPage } from './company-contacts.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {NoItemsModule} from "../../../../components/no-items/no-items.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    NoItemsModule,
    CompanyContactsPageRoutingModule
  ],
  declarations: [CompanyContactsPage]
})
export class CompanyContactsPageModule {}
