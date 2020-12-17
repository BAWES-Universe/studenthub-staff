import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoteModule } from 'src/app/components/note/note.module';
import { IonicModule } from '@ionic/angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CompanyNotesPageRoutingModule } from './company-notes-routing.module';

import { CompanyNotesPage } from './company-notes.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    LoadingModalModule,
    NoteModule,
    IonicModule,
    CompanyNotesPageRoutingModule
  ],
  declarations: [CompanyNotesPage]
})
export class CompanyNotesPageModule {}
