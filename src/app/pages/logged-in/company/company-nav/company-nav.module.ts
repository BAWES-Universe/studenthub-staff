import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyNavPageRoutingModule } from './company-nav-routing.module';

import { CompanyNavPage } from './company-nav.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyNavPageRoutingModule
  ],
  declarations: [CompanyNavPage]
})
export class CompanyNavPageModule {}
