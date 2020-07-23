import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyListPageRoutingModule } from './company-list-routing.module';

import { CompanyListPage } from './company-list.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CompanyListPageRoutingModule,
        LoadingModalModule
    ],
  declarations: [CompanyListPage]
})
export class CompanyListPageModule {}
