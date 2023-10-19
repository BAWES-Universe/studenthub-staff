import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateAccountPageRoutingModule } from './update-account-routing.module';

import { UpdateAccountPage } from './update-account.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoadingModalModule,
    UpdateAccountPageRoutingModule
  ],
  declarations: [UpdateAccountPage]
})
export class UpdateAccountPageModule {}
