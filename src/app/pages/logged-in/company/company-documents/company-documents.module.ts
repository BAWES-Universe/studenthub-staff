import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyDocumentsPageRoutingModule } from './company-documents-routing.module';

import { CompanyDocumentsPage } from './company-documents.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    LoadingModalModule,
    CompanyDocumentsPageRoutingModule
  ],
  declarations: [CompanyDocumentsPage]
})
export class CompanyDocumentsPageModule {}
