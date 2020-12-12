import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IonicModule } from '@ionic/angular';

import { CompanyViewPageRoutingModule } from './company-view-routing.module';

import { CompanyViewPage } from './company-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import {RequestListingModule} from "../../../../components/request-listing/request-listing.module";
import { NoteModule } from 'src/app/components/note/note.module';
import {CompanyModule} from "../../../../components/company/company.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModalModule,
    IonicModule,
    PipesModule,
    CKEditorModule,
    RequestListingModule,
    NoteModule,
    CompanyViewPageRoutingModule,
    CompanyModule
  ],
  declarations: [CompanyViewPage]
})
export class CompanyViewPageModule {}
