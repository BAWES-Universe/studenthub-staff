import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyContactsPageRoutingModule } from './company-contacts-routing.module';

import { CompanyContactsPage } from './company-contacts.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    CompanyContactsPageRoutingModule
  ],
  declarations: [CompanyContactsPage]
})
export class CompanyContactsPageModule {}
