import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';

import { TranslateModule } from '@ngx-translate/core';
// import { HomePageAlertsModule } from 'src/app/components/home-page-alerts/home-page-alerts.module';


@NgModule({
  imports: [
    // HomePageAlertsModule,
    IonicModule,
    CommonModule, 
    TranslateModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
