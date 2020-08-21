import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlertController, ModalController, NavController, ToastController, Platform } from '@ionic/angular';

import { Store } from 'src/app/models/store';
import { Company } from '../../../../models/company';

import { StoreFormPage } from '../store-form/store-form.page';

import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CompanyService } from '../../../../providers/logged-in/company.service';
import { AwsService } from '../../../../providers/aws.service';
import { CompanyContact } from 'src/app/models/company-contact';
import { CompanyContactFormPage } from '../../company/company-contact-form/company-contact-form.page';
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { AuthService } from 'src/app/providers/auth.service';



@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.page.html',
  styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public loading = false;
  public stores: Store[];
  public company: Company;

  public companyContacts: CompanyContact[] = [];

  private company_id;

  constructor(
    public platform: Platform,
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public storeService: StoreService,
    public companyService: CompanyService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    public aws: AwsService,
    public authService: AuthService,
    public companyContactService: CompanyContactService
  ) {
    this.company_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadData(this.currentPage);
    this.loadCompany();
    this.loadContacts();
  }

  loadContacts() {
    this.companyContactService.companyContacts(this.company_id).subscribe(data => {
      this.companyContacts = data;
    });
  }

  async onContactSelected(companyContact) {
    const modal = await this.modalCtrl.create({
      component: CompanyContactFormPage,
      componentProps: { 
        model: companyContact
      }
    });

    // Refresh List if required
    modal.onDidDismiss().then(e => {
      if (e && e.data && e.data.refresh) {
        this.loadContacts();
      }
    });
    modal.present();
  }

  async addCompanyContact() {

    let companyContact = new CompanyContact;
    companyContact.company_id = this.company_id;
    
    const modal = await this.modalCtrl.create({
      component: CompanyContactFormPage,
      componentProps: { 
        model: companyContact
      }
    });

    // Refresh List if required
    modal.onDidDismiss().then(e => {
      if (e && e.data && e.data.refresh) {
        this.loadContacts();
      }
    });
    modal.present();
  }

  doNothing(event) {
    event.stopPropagation();
  }

  async deleteContact(event, companyContact) {

    event.preventDefault();
    event.stopPropagation();

    this.companyContactService.delete(companyContact).subscribe(async response => {

      if (response.operation == 'success')
      {
        this.companyContacts = this.companyContacts.filter(e => e.contact_uuid != companyContact.contact_uuid);
      }
      else
      {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }

  /**
   * current page link
   * @param page
   */
  pageLinkColor(page: number) {

    if (page == this.currentPage) {
      return 'light';
    }

    return '';
  }

  /**
   * load store list
   * @param page
   */
  async loadData(page: number) {
    // Load list of ALL stores
    this.loading = true;
    this.storeService.getStoresBelongingToCompany(this.company_id, this.currentPage).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for (let i = 1; i <= this.pageCount; i++) {
        this.pages.push(i);
      }

      // hide if no page = 1

      if (this.pageCount == 1) {
        this.pages = [];
      }

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
   * Loads the create page
   */
  async create() {
    const modal = await this.modalCtrl.create({
      component: StoreFormPage,
      componentProps: {
        company_id: this.company_id
      },
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data => {
      if (data && data.data && data.data.refresh) {
        this.loadData(this.currentPage);
      }
    });
    return await modal.present();
  }

  /**
   * Delete the provided model
   */
  async delete(store: Store) {
    this.loading = true;
    const confirm = await this.alertCtrl.create({
      header: 'Delete Store?',
      message: 'Are you sure you want to delete this Store?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.storeService.delete(store).subscribe(async jsonResp => {
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
                const toast = await this._toastCtrl.create({
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
            // this.loadData(this.currentPage);
            // loader.dismiss();
            console.log('no');
          }
        }
      ]
    });
    confirm.present();
  }

  doInfinite(event) {
    this.loading = true;

    this.currentPage++;
    this.storeService.getStoresBelongingToCompany(this.company_id, this.currentPage).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

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

  /**
   * view detail
   */
  loadCompany() {
    this.companyService.companyDetail(this.company_id).subscribe(response => {
      this.company = response;
    });
  }

  loadLogo($event, company) {
    company.company_logo = null;
  }
}
