import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandViewPageRoutingModule } from './brand-view-routing.module';

import { BrandViewPage } from './brand-view.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
import {StoreModule} from "../../../../components/store/store.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        CandidateModule,
        StoreModule,
        BrandViewPageRoutingModule,
        LoadingModalModule
    ],
  declarations: [BrandViewPage]
})
export class BrandViewPageModule {}
