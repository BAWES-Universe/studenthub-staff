import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {AlertController, ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// model
import { Candidate } from 'src/app/models/candidate';
import { Brand } from 'src/app/models/brand';
import { Store } from 'src/app/models/store';
// service
import { AwsService } from 'src/app/providers/aws.service';
import { BrandService } from 'src/app/providers/logged-in/brand.service';
import { EventService } from 'src/app/providers/event.service';
import { BrandFormPage } from '../brand-form/brand-form.page';
import {BrandOptionPage} from "../brand/brand-option/brand-option.page";
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-brand-view',
  templateUrl: './brand-view.page.html',
  styleUrls: ['./brand-view.page.scss'],
})
export class BrandViewPage implements OnInit {

  public brand: Brand;
  public brand_uuid = null;
  public loading = false;
  public deleting = false;

  public borderLimit = false;
  public segment: string = 'candidate';

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    public aws: AwsService,
    private brandService: BrandService,
    private alertCtrl: AlertController,
    private location: Location,
    public authService: AuthService,
    private eventService: EventService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Brand View Page');

    if(!this.brand_uuid)
      this.brand_uuid = this.activatedRoute.snapshot.paramMap.get('id');

    this.loadData();
  }

  /**
   * On candidate selected from list
   */
  candidateSelected(candidate: Candidate) {
    this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
      state: {
        model: candidate
      }
    });
  }

  /**
   * store selected
   * @param store
   */
  storeSelected(store: Store) {
    this.navCtrl.navigateForward('store-view/' + store.store_id, {
      state: {
        model: store
      }
    });
  }

  /**
   * load brand view
   */
  loadData() {
    this.loading = true;
    this.brandService.view(this.brand_uuid).subscribe(response => {
      this.loading = false;
      this.brand = response;
    });
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  async deleteBrand(event, brand) {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Brand',
      message: 'Do you want to delete this brand?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deleting = true;

            this.brandService.delete(brand).subscribe(async jsonResp => {
              this.eventService.reloadBrand$.next({});

              this.eventService.reloadStats$.next({
                company_id: this.brand.company_id
              });

              // On Success
              if (jsonResp.operation == 'success') {
                this.location.back();
              }

              // On Failure
              if (jsonResp.operation == 'error') {

                this.deleting = false;

                // failer text
                const prompt = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: this.authService.errorMessage(jsonResp.message),
                  buttons: ['Okay']
                });
                prompt.present();
              }

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


  async editBrandSelected(event, brand) {

    event.preventDefault();
    event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: BrandFormPage,
      componentProps: {
        model: brand
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadData();
      }
    });
    modal.present();
  }
  segmentChanged(event) {
    this.segment = event.target.value;
  }

  /**
   * popover for store option
   * @param event
   */
  async options(event) {

    event.preventDefault();
    event.stopPropagation();

    const popover = await this.popoverCtrl.create({
      component: BrandOptionPage,
      cssClass: 'store-option',
      event,
      translucent: true,
      showBackdrop: false
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if(data && data.action == 'delete') {
      this.deleteBrand(event, this.brand);
    }

    if(data && data.action == 'edit') {
      this.editBrandSelected(event, this.brand);
    }
  }
}
