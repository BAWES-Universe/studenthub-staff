import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyContactListPageRoutingModule } from './company-contact-list-routing.module';

import { CompanyContactListPage } from './company-contact-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CompanyContactListPageRoutingModule
  ],
  declarations: [CompanyContactListPage]
})
export class CompanyContactListPageModule {}
