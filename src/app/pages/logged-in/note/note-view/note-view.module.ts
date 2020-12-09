import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteViewPageRoutingModule } from './note-view-routing.module';

import { NoteViewPage } from './note-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    LoadingModalModule,
    NoteViewPageRoutingModule
  ],
  declarations: [NoteViewPage]
})
export class NoteViewPageModule {}
