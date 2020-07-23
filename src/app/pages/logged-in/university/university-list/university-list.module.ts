import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UniversityListPageRoutingModule } from './university-list-routing.module';

import { UniversityListPage } from './university-list.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UniversityListPageRoutingModule,
        LoadingModalModule
    ],
  declarations: [UniversityListPage]
})
export class UniversityListPageModule {}
