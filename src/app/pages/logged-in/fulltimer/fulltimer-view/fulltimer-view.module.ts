import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulltimerViewPageRoutingModule } from './fulltimer-view-routing.module';

import { FulltimerViewPage } from './fulltimer-view.page';

import { LoadingModalModule } from '../../../../components/loading-modal/loading-modal.module';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { NoteModule } from 'src/app/components/note/note.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
    FormsModule,
    IonicModule,
    NoteModule,
    TranslateModule.forChild(),
    FulltimerViewPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [FulltimerViewPage]
})
export class FulltimerViewPageModule { }
