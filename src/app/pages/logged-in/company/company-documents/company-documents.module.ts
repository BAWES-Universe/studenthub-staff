import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyDocumentsPageRoutingModule } from './company-documents-routing.module';

import { CompanyDocumentsPage } from './company-documents.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    CompanyDocumentsPageRoutingModule
  ],
  declarations: [CompanyDocumentsPage]
})
export class CompanyDocumentsPageModule {}
