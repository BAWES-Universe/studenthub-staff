import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanySubcompaniesPageRoutingModule } from './company-subcompanies-routing.module';

import { CompanySubcompaniesPage } from './company-subcompanies.page';

import {CompanyModule} from "../../../../components/company/company.module";
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoadingModalModule,
    IonicModule,
    CompanyModule,
    CompanySubcompaniesPageRoutingModule
  ],
  declarations: [CompanySubcompaniesPage]
})
export class CompanySubcompaniesPageModule {}
