import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController, Platform } from '@ionic/angular';
//models
import { Mall } from "../../../../models/mall";
import { Store } from 'src/app/models/store';
import { Company } from '../../../../models/company';
//pages
import { StoreFormPage } from '../store-form/store-form.page';
import { StoreManagerFormPage } from '../store-manager-form/store-manager-form.page';
//services
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CompanyService } from '../../../../providers/logged-in/company.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from "src/app/providers/event.service";
import { MallService } from "../../../../providers/logged-in/mall.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.page.html',
  styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {

  public pageCount = 0;

  public currentPage = 1;

  public loading = false;

  public deleting = false;

  public stores: Store[];

  public company: Company;

  public malls: Mall[];

  public updating: boolean = false;

  private company_id;

  public borderLimit = false; 

  constructor(
    public platform: Platform,
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public storeService: StoreService,
    public companyService: CompanyService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public mallService: MallService,
    public authService: AuthService,
    public analyticService: AnalyticsService,
    public eventService: EventService,
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Store List Page');

    if(!this.company_id)
      this.company_id = this.activatedRoute.snapshot.paramMap.get('id');

    this.loadData(this.currentPage);
    this.loadCompany();
    this.loadMall();

    this.eventService.reloadCandidateHistory$.subscribe(response => {
      this.loadData(this.currentPage);
      this.loadCompany();
    });

    this.eventService.storeUpdated$.subscribe(response => {
      this.loadData(this.currentPage); 
    });

    this.eventService.storeDeleted$.subscribe(response => {
      this.loadData(this.currentPage); 
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

  /**
   * view detail
   */
  loadCompany() {
    this.companyService.companyDetail(this.company_id).subscribe(response => {
      this.company = response;
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date) 
      return null;
      
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  /**
   * load store list
   * @param page
   */
  async loadData(page: number) {
 
    this.loading = true;

    this.storeService.getStoresBelongingToCompany(this.company_id, this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.stores = response.body;
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
    this.navCtrl.navigateForward('store-view/' + model.store_id, {
      state: {
        model
      }
    });
  }

  /**
   * open popup to select store manager
   * @param event 
   * @param store 
   */
  async selectStoreManager(event, store) {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    event.preventDefault();
    event.stopPropagation();

    const modal = await this.modalCtrl.create({
      component: StoreManagerFormPage,
      componentProps: {
        company: this.company
      },
      cssClass: "popup-modal"
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.updateStoreManager(store, e.data.storeManager);
      }
    });
    return await modal.present();
  }

  /**
   * update store manager
   * @param store 
   * @param storeManager 
   */
  updateStoreManager(store, storeManager) {

    this.updating = true;

    this.storeService.updateStoreManager(store, storeManager).subscribe(async data => {
      this.updating = false;

      if (data.operation == 'success') {
        store.storeManager = storeManager;
        store.store_manager_uuid = storeManager.contact_uuid;
      }

      if (data.operation == 'error') {
        const alert = await this.alertCtrl.create({
          header: 'Deletion Error!',
          message: this.authService.errorMessage(data.message),
          buttons: ['Okay']
        });
        alert.present();
      }
    }, () => {
      this.updating = false;
    });
  }

  /**
   * Loads the create page
   */
  async create() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StoreFormPage,
      componentProps: {
        company_id: this.company_id,
        company: this.company,
        brands: this.company.brands,
        malls: this.malls
      },
      cssClass: "popup-modal"
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

  /**
   * Delete the provided model
   */
  async delete(event, store: Store) {

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

            this.storeService.delete(store).subscribe(async jsonResp => {

              this.loading = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  subHeader: this.authService.errorMessage(jsonResp.message),
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
              
              this.loadData(this.currentPage);
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

  doInfinite(event) {
    this.loading = true;

    this.currentPage++;

    this.storeService.getStoresBelongingToCompany(this.company_id, this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.stores = this.stores.concat(response.body);
    },
      error => {
      },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
