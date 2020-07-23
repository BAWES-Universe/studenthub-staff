import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.page.html',
  styleUrls: ['./server-error.page.scss'],
})
export class ServerErrorPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.modalCtrl.getTop().then(overlay => {
      if(overlay) {
        overlay.dismiss();
      }
    })

    this.loadingCtrl.getTop().then(overlay => {
      if(overlay) {
        overlay.dismiss();
      }
    })
  }

  /**
   * Open dashboard
   */
  dashboard() {
    this.router.navigate(['view']);
  }
}
