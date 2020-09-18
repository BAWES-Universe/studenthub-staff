import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from "@ionic/angular";
import {ActivatedRoute} from '@angular/router';

import {MallService} from 'src/app/providers/logged-in/mall.service';

import {Mall} from 'src/app/models/mall';

import {MallFormPage} from "../mall-form/mall-form.page";
import {Candidate} from "../../../../models/candidate";

@Component({
  selector: 'app-mall-view',
  templateUrl: './mall-view.page.html',
  styleUrls: ['./mall-view.page.scss'],
})
export class MallViewPage implements OnInit {

  public mallUUID: string;
  public mall: Mall;
  public loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mallService: MallService,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.mallUUID = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadData();
  }

  loadData(){
    this.loading = true;
    this.mallService.view(this.mallUUID).subscribe(res => {
      this.loading = false;
      this.mall = res;
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
}
