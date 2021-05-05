import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FulltimeLocationPage } from './fulltime-location.page';
// import { SharedModule } from 'src/app/shared.module';
import { TranslateModule } from '@ngx-translate/core';
// import { ProgressBarModule } from 'src/app/components/progress-bar/progress-bar.module';

const routes: Routes = [
  {
    path: '',
    component: FulltimeLocationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    // SharedModule,
    // ProgressBarModule,
    TranslateModule.forChild(),
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FulltimeLocationPage]
})
export class FulltimeLocationPageModule {}
