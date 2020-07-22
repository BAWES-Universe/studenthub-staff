import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountryViewPageRoutingModule } from './country-view-routing.module';

import { CountryViewPage } from './country-view.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import { CandidateModule } from 'src/app/components/candidate/candidate.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CandidateModule,
        CountryViewPageRoutingModule,
        LoadingModalModule
    ],
  declarations: [CountryViewPage]
})
export class CountryViewPageModule {}
