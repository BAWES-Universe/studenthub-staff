import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyContactRolePageRoutingModule } from './company-contact-role-routing.module';

import { CompanyContactRolePage } from './company-contact-role.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyContactRolePageRoutingModule
  ],
  declarations: [CompanyContactRolePage]
})
export class CompanyContactRolePageModule {}
