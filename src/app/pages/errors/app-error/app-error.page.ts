import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, LoadingController, ModalController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { StorageService } from 'src/app/providers/storage.service';


@Component({
  selector: 'pogi-app-error',
  templateUrl: './app-error.page.html',
  styleUrls: ['./app-error.page.scss'],
})
export class AppErrorPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public storageService: StorageService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('App Error Page');
  }

  ionViewWillEnter() {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss();
      }
    });

    this.loadingCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss();
      }
    });
  }

  /**
   * Open home page
   */
  async home() {
    
    this.storageService.get('loggedInUser').then(ret => {

      this.navCtrl.navigateRoot('/');
    }).catch(r => {

      this.toastCtrl.create({
        message: 'Please, enable cookies/ storage.',
        duration: 3000,
      }).then(toast => toast.present());
    });
  }
}
