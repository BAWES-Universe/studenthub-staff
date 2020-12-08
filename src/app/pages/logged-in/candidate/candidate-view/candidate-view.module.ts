import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

import { IonicModule } from '@ionic/angular';

import { CandidateViewPageRoutingModule } from './candidate-view-routing.module';

import { CandidateViewPage } from './candidate-view.page';
import {SelectSearchModule} from 'src/app/components/select-search/select-search.module';
import {LoadingModalModule} from '../../../../components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { NoteModule } from 'src/app/components/note/note.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CandidateViewPageRoutingModule,
        SelectSearchModule,
        NoItemsModule,
        CKEditorModule,
        NoteModule,
        LoadingModalModule
    ],
  declarations: [CandidateViewPage]
})
export class CandidateViewPageModule {}
