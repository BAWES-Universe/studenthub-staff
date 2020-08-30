import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ModalController, AlertController, ToastController } from '@ionic/angular';
//services
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { AwsService } from 'src/app/providers/aws.service';
import { AuthService } from 'src/app/providers/auth.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
//models
import { CompanyContact } from 'src/app/models/company-contact';
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
import { Brand } from 'src/app/models/brand'; 
import { Request } from 'src/app/models/request';
//pages
import { UploadFilePage } from "../upload-file/upload-file.page";
import { CompanyContactFormPage } from '../company-contact-form/company-contact-form.page';
import { CompanyFollowupNotePage } from '../company-followup-note/company-followup-note.page';
import { CompanyRequestFormPage } from '../company-request-form/company-request-form.page';


@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.page.html',
  styleUrls: ['./company-view.page.scss'],
})
export class CompanyViewPage implements OnInit {

  public company_id;

  public company: Company;
  public subCompanies: Company[] = [];
  public stores: Store[] = [];

  public companyContacts: CompanyContact[] = [];

  public brands: Brand[] = [];

  public deleting = false;
  public loading = false;
  public sendingNewPassword = false;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public router: Router,
    public activatedRoute: ActivatedRoute, 
    public companyService: CompanyService,
    public authService: AuthService,
    public requestService: CompanyRequestService,
    public companyContactService: CompanyContactService,
    public storeService: StoreService,
    public awsService: AwsService
  ) { }

  ngOnInit() {

    // Load the passed model if available
    if (window && window.history.state) {
      this.company = window.history.state.model;
    }

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    this.loadData();
    this.loadContacts();
  }

  /**
   * load compay data
   */
  async loadData(silent = false) {

    if (!silent) {
      this.loading = true;
    }

    if (!this.company) {
      this.company = new Company;
      this.company.company_id = this.company_id;
    }

    this.companyService.view(this.company_id).subscribe(response => {

      this.loading = false;
      this.deleting = false;

      this.company = response;

      this.subCompanies = response.subCompanies;
      this.stores = response.stores;

      this.brands = response.brands;

    }, () => {
      this.loading = false;
      this.deleting = false;
    });
  }

  /**
   * add followup note
   */
  async addFollowupNote() {
    const modal = await this.modalCtrl.create({
      component: CompanyFollowupNotePage,
      componentProps: { 
        company_id: this.company_id
      }
    });
    modal.onDidDismiss().then(e => {
      if (e && e.data && e.data.company_last_followup_datetime && this.company) {
        this.company.company_last_followup_datetime = e.data.company_last_followup_datetime;
        this.loadData(true);
      }
    });
    modal.present();
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/'));
  }

  /**
   * Load company detail page when its selected from the list
   * @param model
   */
  rowSelected(model) {
    this.router.navigate(['company-view', model.company_id], {
      state: {
        model: model
      }
    });
  }

  /**
   * push select company data to store view
   * @param model
   */
  storeSelected(model) {
    this.router.navigate(['store-view', model.store_id], {
      state: {
        model: model
      }
    });
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
   * view detail
   */
  viewDetail() {
    this.loading = true;
    this.companyService.view(this.company_id).subscribe( response => {
      this.loading = false;
      this.company = response;
    });
  }

  async uploadDocument() {
    const modal = await this.modalCtrl.create({
      component: UploadFilePage,
      componentProps: {
        company: this.company,
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.refresh) {
      this.loadData();
    }
  }

  async editRequest(request) {

    this.company.companyContacts = this.companyContacts;

    const modal = await this.modalCtrl.create({
      component: CompanyRequestFormPage,
      componentProps: {
        company: this.company,
        request: request,
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.viewDetail();
    }
  }

  async addRequest() {

    let request = new Request;

    this.company.companyContacts = this.companyContacts;

    const modal = await this.modalCtrl.create({
      component: CompanyRequestFormPage,
      componentProps: {
        company: this.company,
        request: request,
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.viewDetail();
    }
  }

  startRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.requestService.start(request).subscribe(async response => {

      if (response.operation == 'success') {
        request.request_status = 'started';
      } else {
        this.toastCtrl.create({
          message: response.message,
          buttons: ['Ok']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }

  cancelledRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.requestService.cancel(request).subscribe(async response => {

      if (response.operation == 'success') {
        request.request_status = 'cancelled';
      } else {
        this.toastCtrl.create({
          message: response.message,
          buttons: ['Ok']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }

  deliveredRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.requestService.deliver(request).subscribe(async response => {

      if (response.operation == 'success') {
        request.request_status = 'delivered';
      } else {
        this.toastCtrl.create({
          message: response.message,
          buttons: ['Ok']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }
}
