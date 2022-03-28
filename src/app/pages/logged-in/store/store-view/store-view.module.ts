import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreViewPageRoutingModule } from './store-view-routing.module';

import { StoreViewPage } from './store-view.page';
import {LoadingModalModule} from "src/app/components/loading-modal/loading-modal.module";
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
import { StoreOptionPageModule } from '../store-option/store-option.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        CandidateModule,
        StoreViewPageRoutingModule,
        LoadingModalModule,
        StoreOptionPageModule
    ],
  declarations: [
    StoreViewPage
  ]
})
export class StoreViewPageModule {}
