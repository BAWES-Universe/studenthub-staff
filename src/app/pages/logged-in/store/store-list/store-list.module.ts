import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreListPageRoutingModule } from './store-list-routing.module';

import { StoreListPage } from './store-list.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        StoreListPageRoutingModule,
        LoadingModalModule
    ],
  declarations: [StoreListPage]
})
export class StoreListPageModule {}
