import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyContactViewPageRoutingModule } from './company-contact-view-routing.module';

import { CompanyContactViewPage } from './company-contact-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NoteModule } from 'src/app/components/note/note.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    CKEditorModule,
    LoadingModalModule,
    NoteModule,
    CompanyContactViewPageRoutingModule
  ],
  declarations: [CompanyContactViewPage]
})
export class CompanyContactViewPageModule { }
