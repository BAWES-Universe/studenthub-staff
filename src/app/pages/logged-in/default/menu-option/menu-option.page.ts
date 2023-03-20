import { Component, Input, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import {EventService} from "src/app/providers/event.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.page.html',
  styleUrls: ['./menu-option.page.scss'],
})
export class MenuOptionPage implements OnInit {

  public sendingPassword = false;

  constructor(
    public translateService: TranslateLabelService,
    public popoverCtrl: PopoverController,
    public eventService: EventService,
    public analyticService: AnalyticsService,
    public navCtrl: NavController,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.analyticService.page('Option Page');
  }

  /**
   * close popup
   */
  dismiss() {
    this.popoverCtrl.getTop().then(o => {
      if(o) {
        o.dismiss();
      }
    });
  }

  /**
   * change password
   */
  async changePassword(event) {
    this.popoverCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ changePassword: true });
      }
    });
  }

  page(url) {
    this.popoverCtrl.dismiss();

    if (url == 'logout') {
      this.authService.logout();
    } else {
      this.navCtrl.navigateForward([url]);
    }
  }
}
