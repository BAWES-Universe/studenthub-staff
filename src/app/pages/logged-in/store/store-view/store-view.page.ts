import { Component, OnInit } from '@angular/core';
import {ActionSheetController, AlertController, ModalController, NavController, NavParams, PopoverController, ToastController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// model
import { Store } from '../../../../models/store';
import { Candidate } from '../../../../models/candidate';
// page
import { StoreFormPage } from '../store-form/store-form.page';
// service
import { StoreService } from '../../../../providers/logged-in/store.service';
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from '../../../../providers/event.service';
import { MallService } from '../../../../providers/logged-in/mall.service';
import { Mall } from '../../../../models/mall';
import { StoreManagerFormPage } from '../store-manager-form/store-manager-form.page';
import { AuthService } from '../../../../providers/auth.service';
import { StoreOptionPage } from '../store-option/store-option.page';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-store-view',
  templateUrl: './store-view.page.html',
  styleUrls: ['./store-view.page.scss'],
})
export class StoreViewPage implements OnInit {

  public store: Store;
  public store_id = null;
  public company_id = null;
  public loading = false;
  public malls: Mall[];

  public borderLimit = false;
  public directView = false;

  public updating = false;

  public loadingLoginUrl: boolean = false; 
  
  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    public aws: AwsService,
    private storeService: StoreService,
    private eventService: EventService,
    private mallService: MallService,
    private authService: AuthService,
    public analyticService: AnalyticsService,
    private toastCtrl: ToastController,
    private navParams: NavParams
  ) {
  }

  ngOnInit() {
    
    this.analyticService.page('Store View Page');

    if (!this.store_id && this.activatedRoute.snapshot.paramMap.get('id')) {
      this.store_id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    if (this.navParams && this.navParams.data && this.navParams.data['store_id']) {
      this.store_id = this.navParams.data['store_id'];
    }

    if (this.navParams && this.navParams.data && this.navParams.data['view']) {
      this.directView = true;
    }

    const state = window.history.state;

    // if (state['model']) {
    //   this.store = state['model'];
    // } else {
    // }
    if (this.store_id) {
      this.loadData();
      this.loadMall();
    }

    this.eventService.reloadCandidateHistory$.subscribe(response => {
      this.loadData();
    });
  }

  /**
   * On candidate selected from list
   */
  candidateSelected(candidate: Candidate) {
    this.modalCtrl.dismiss().then(() => {
      setTimeout(() => {
        this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
          state: {
            model: candidate
          }
        });
      }, 100);
    });
  }

  /**
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StoreFormPage,
      componentProps: {
        model: this.store,
        brands: this.store.company.brands,
        malls: this.malls
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
   * remove store manager
   */
  removeStoreManager() {

    this.updating = true;

    this.storeService.removeStoreManager(this.store).subscribe(async data => {

      this.updating = false;

      if (data.operation == 'success') {
        this.store.storeManager = null;
        this.store.store_manager_uuid = null;
      }

      if (data.operation == 'error') {
        const alert = await this.alertCtrl.create({
          header: 'Selection Error!',
          subHeader: this.authService.errorMessage(data.message),
          buttons: ['Okay']
        });
        alert.present();
      }
    }, () => {
      this.updating = false;
    });
  }

  /**
   * open popup to select store manager
   * @param event
   * @param store
   */
  async selectStoreManager() {

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StoreManagerFormPage,
      componentProps: {
        company: this.store.company
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.updateStoreManager(e.data.storeManager);
      }
    });
    return await modal.present();
  }

  /**
   * update store manager
   * @param storeManager
   */
  updateStoreManager(storeManager) {

    this.updating = true;

    this.storeService.updateStoreManager(this.store, storeManager).subscribe(async data => {

      this.updating = false;

      if (data.operation == 'success') {
        this.store.storeManager = storeManager;
        this.store.store_manager_uuid = storeManager.contact_uuid;
      }

      if (data.operation == 'error') {
        const alert = await this.alertCtrl.create({
          header: 'Selection Error!',
          subHeader: this.authService.errorMessage(data.message),
          buttons: ['Okay']
        });
        alert.present();
      }
    }, () => {
      this.updating = false;
    });
  }

  login() {
    this.loadingLoginUrl = true; 

    this.storeService.login(this.store_id).subscribe(async res => {

      this.loadingLoginUrl = false;
       
      if(res.operation == "error") {
        const alert = await this.alertCtrl.create({
          header: 'Oops',
          subHeader: this.authService.errorMessage(res.message),
          buttons: ['Okay']
        });
        alert.present();
      } else {
        window.open(res.redirect, "_blank");
      }
    });
  }

  loadData() {
    this.loading = true;

    this.storeService.detail(this.store_id).subscribe(response => {
      this.loading = false;
      this.store = response;
      this.company_id = response.company_id;
    });
  }

  /**
   * load all mails
   */
  async loadMall() {
    this.mallService.fullList().subscribe(response => {
      this.malls = response;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Delete the provided model
   */
  async deleteStore(event, store: Store) {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Store',
      message: 'Are you sure you want to delete this Store?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.updating = true;

            this.storeService.delete(store).subscribe(async jsonResp => {

              this.updating = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  subHeader: this.authService.errorMessage(jsonResp.message),
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {

                this.eventService.reloadStats$.next({
                  company_id: this.company_id
                });
                const toast = await this.toastCtrl.create({
                  message: this.authService.errorMessage(jsonResp.message),
                  duration: 3000
                });
                toast.present();

                this.navCtrl.navigateBack('company-stores/' + this.company_id);
              }
            }, () => {
              this.updating = false;
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
   * popover for store option
   * @param event
   */
  async options(event) {

    const popover = await this.popoverCtrl.create({
      component: StoreOptionPage,
      cssClass: 'store-option',
      event: event,
      translucent: true,
      showBackdrop: false
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if(data && data.action == 'delete') {
      this.delete();
    }

    if(data && data.action == 'edit') {
      this.edit();
    }
  }

  /**
   * open store form
   */
  async edit() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StoreFormPage,
      componentProps: {
        company_id: this.company_id,
        company: this.store.company,
        model: this.store,
        brands: this.store.company?.brands,
        malls: this.malls
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();

        this.eventService.storeUpdated$.next({});

      }
    });
    return await modal.present();
  }

  /**
   * Delete the provided model
   */
  async delete() {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Store?',
      message: 'Are you sure you want to delete this Store?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.loading = true;

            this.storeService.delete(this.store).subscribe(async jsonResp => {

              this.loading = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: this.authService.errorMessage(jsonResp.message),
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {
                const toast = await this.toastCtrl.create({
                  message: this.authService.errorMessage(jsonResp.message),
                  duration: 3000
                });
                toast.present();
              }

              this.navCtrl.back();

              this.eventService.storeDeleted$.next({});
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
  close() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        this.modalCtrl.dismiss();
      }
    });
  }
}
