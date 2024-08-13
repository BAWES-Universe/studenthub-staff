import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateViewPageRoutingModule } from './candidate-view-routing.module';

import { CandidateViewPage } from './candidate-view.page';

import { LoadingModalModule } from '../../../../components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { NoteModule } from 'src/app/components/note/note.module';
import { TransferModule } from 'src/app/components/transfer/transfer.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';
import { InterviewEvaluationModule } from 'src/app/components/interview-evaluation/interview-evaluation.module';
import { InterviewEvaluationFormPageModule } from '../interview-evaluation/interview-evaluation-form/interview-evaluation-form.module';
import { CandidateCertificateFormPageModule } from '../candidate-certificate-form/candidate-certificate-form.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CandidateViewPageRoutingModule,
        NoItemsModule,
        RequestListingModule,
        InterviewEvaluationFormPageModule,
        CandidateCertificateFormPageModule,
        InterviewEvaluationModule,
        TranslateModule.forChild(),
        NoteModule,
        PipesModule,
        TransferModule,
        LoadingModalModule
    ],
  declarations: [CandidateViewPage]
})
export class CandidateViewPageModule {}
