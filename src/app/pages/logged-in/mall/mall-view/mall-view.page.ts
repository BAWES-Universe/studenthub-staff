import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from "@ionic/angular";
import { ActivatedRoute } from '@angular/router';
//services
import { MallService } from 'src/app/providers/logged-in/mall.service';
//models
import { Mall } from 'src/app/models/mall';
//pages
import { MallFormPage } from "../mall-form/mall-form.page";


@Component({
  selector: 'app-mall-view',
  templateUrl: './mall-view.page.html',
  styleUrls: ['./mall-view.page.scss'],
})
export class MallViewPage implements OnInit {

  public borderLimit = false;

  public mall_uuid: string;
  
  public mall;

  public loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mallService: MallService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    
    if(!this.mall_uuid)
      this.mall_uuid = this.activatedRoute.snapshot.paramMap.get('id');

    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.mallService.view(this.mall_uuid).subscribe(data => {
      this.loading = false;
    
      this.mall = data;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: MallFormPage,
      componentProps: {
        model: this.mall,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();
      }
    });

    return await modal.present();
  }

  /**
   * On candidate selected from list
   */
  rowSelected(store) {
    this.navCtrl.navigateForward('store-view/' + store.store_id);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  async delete(event, mall: Mall) {
    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Mall?',
      message: 'Are you sure you want to delete this Mall?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.loading = true;
            this.mallService.delete(mall).subscribe(async jsonResp => {
              this.loading = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  subHeader: jsonResp.message,
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {
                const toast = await this.toastCtrl.create({
                  message: jsonResp.message,
                  duration: 3000
                });
                toast.present();
              }
              this.navCtrl.navigateBack('/mall-list');
            });
          }
        },
        {
          text: 'No'
        }
      ]
    });
    confirm.present();
  }

  /**
   * close page
   */
  dismiss() {
    this.modalCtrl.getTop().then(overlay => {
      if(overlay) {
        overlay.dismiss();
      }
    });
  }
}
