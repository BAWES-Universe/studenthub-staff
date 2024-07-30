import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateNotesPageRoutingModule } from './candidate-notes-routing.module';

import { CandidateNotesPage } from './candidate-notes.page';
import { NoteModule } from 'src/app/components/note/note.module';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteModule,
    NoItemsModule,
    LoadingModalModule,
    CandidateNotesPageRoutingModule
  ],
  declarations: [CandidateNotesPage]
})
export class CandidateNotesPageModule {}
