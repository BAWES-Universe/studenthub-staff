import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulltimerNotesPageRoutingModule } from './fulltimer-notes-routing.module';

import { FulltimerNotesPage } from './fulltimer-notes.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoteModule } from 'src/app/components/note/note.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteModule,
    LoadingModalModule,
    FulltimerNotesPageRoutingModule
  ],
  declarations: [FulltimerNotesPage]
})
export class FulltimerNotesPageModule {}
