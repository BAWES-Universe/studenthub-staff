import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';

import {MallService} from 'src/app/providers/logged-in/mall.service';

import {Mall} from 'src/app/models/mall';

import {MallFormPage} from '../mall-form/mall-form.page';

@Component({
  selector: 'app-mall-list',
  templateUrl: './mall-list.page.html',
  styleUrls: ['./mall-list.page.scss'],
})
export class MallListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadMore = false;
  public deleting = false;
  public malls: Mall[] = [];

  constructor(
    private mallService: MallService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadData(page: number, loading = true) {

    this.loading = loading;
    this.mallService.list(this.currentPage).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');
        this.malls = response.body;
      },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('mall-view/' + model.mall_uuid, {
      state: {
        model
      }
    });
  }

  /**
   * Loads the create page
   */
  async create($event, mall: Mall = new Mall()) {
    $event.preventDefault();
    $event.stopPropagation();
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: MallFormPage,
      componentProps: {
        model: mall
      },
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData(this.currentPage);
      }
    });
    return await modal.present();
  }


  async delete(event, mall: Mall) {
    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Store?',
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
              this.loadData(this.currentPage);
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('no');
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * load more
   * @param event
   */
  doInfinite(event) {
    this.loadMore = true;

    this.currentPage++;
    this.mallService.list(this.currentPage).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.malls = this.malls.concat(response.body);
      },
      error => {
      },
      () => {
        this.loadMore = false;
        event.target.complete();
      }
    );
  }


}
