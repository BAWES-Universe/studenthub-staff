import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
// models
import { CompanyContact } from 'src/app/models/company-contact';
import { Company } from "../../../../models/company";
import { Contact } from "../../../../models/contact";
// services
import { CompanyService } from "../../../../providers/logged-in/company.service";
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { EventService } from 'src/app/providers/event.service';
import { AwsService } from 'src/app/providers/aws.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
// pages
import { ModalPopPage } from '../../modal-pop/modal-pop.page';
import { CompanyContactFormPage } from "../company-contact-form/company-contact-form.page";
import { ContactFilterComponent } from 'src/app/components/contact-filter/contact-filter.component';
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-company-contacts',
  templateUrl: './company-contacts.page.html',
  styleUrls: ['./company-contacts.page.scss'],
})
export class CompanyContactsPage implements OnInit {

  public companyContacts: Contact[] = [];

  public company: Company;

  public borderLimit: boolean = false;

  public markingEmailVerified = false; 

  public sendingVerificationMail = false; 
  
  public loading = false;

  public filter: {
    filter_email_unverified: boolean
  } = {
    filter_email_unverified: false
  };

  public currentPage: number;

  public pageCount: number;

  public query = '';

  public loadingLoginUrl: boolean = false; 
  
  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public companyContactService: CompanyContactService,
    public companyService: CompanyService,
    public aws: AwsService,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public eventService: EventService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Company Contact List Page');
    
    const state = window.history.state;

    if (state) {
      this.filter = state;
    }

    this.loadContacts();

    /*if (!this.company) {
      this.loadCompanyDetail();
    }*/
  }


  /**
   * open filter
   * @returns
   */
  async openFilter() {

    const modal = await this.modalCtrl.create({
      component: ContactFilterComponent,
      cssClass: 'modal-request-filter',
      componentProps: {
        filter: Object.assign({}, this.filter),
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data && data.filter_email_unverified != this.filter.filter_email_unverified) {
      this.filter = data;
      this.loadContacts();
    }
  }

  login(companyContact, event) {
    event.preventDefault();
    event.stopPropagation();

    this.loadingLoginUrl = true; 

    this.companyContactService.login(companyContact.contact_uuid).subscribe(async res => {

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

  /**
   * open contact detail page
   * @param companyContact
   */
  async openContactDetail(companyContact, event) {

    event.preventDefault();
    event.stopPropagation();

    this.modalCtrl.dismiss().then(() => { 
      
      this.router.navigateByUrl('company-contact-view/' + companyContact.contact_uuid + '/'+ this.company.company_id, {
        state: {
          model: companyContact
        }
      });/*.then(() => {
        this.dismiss();
      }); */

    });
    
    /*
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyContactViewPage,
      componentProps: {
        contact_uuid: companyContact.contact_uuid,
        companyContact: companyContact
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();*/
  }
  
  clearEmailFilter() {
    this.filter.filter_email_unverified = false;
    this.loadContacts();
  }

  /**
   * retrun url params for filter
   * @returns 
   */
  getUrlParams() {
    let url = this.query;

    if(this.company && this.company.company_id) {
      url += '&company_id=' + this.company.company_id;
    }
 
    if(this.filter.filter_email_unverified) {
      url += '&filter_email_unverified=' + this.filter.filter_email_unverified;
    }

    return url;
  }


  async sendVerificationMail(companyContact, event) {

    event.preventDefault();
    event.stopPropagation();
 
    this.sendingVerificationMail = true; 

    this.companyContactService.sendEmail(companyContact).subscribe(async response => {
 
      this.sendingVerificationMail = false; 
  
      const prompt = await this.alertCtrl.create({
        message: this.authService.errorMessage(response.message),
        buttons: ['Ok']
      });
      prompt.present();
    });
  }

  markEmailVerified(companyContact, event) {

    event.preventDefault();
    event.stopPropagation();

    this.markingEmailVerified = true; 

    this.companyContactService.markEmailVerified(companyContact).subscribe(async response => {
      this.markingEmailVerified = false;
      
      if(response.operation == "error") 
      {
        let prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ["Okay"]
        });
        prompt.present();
      }
      else 
      {
        companyContact.contact_email_verification = true;
      }
    });
  }

  /**
   * load contacts
   */
  loadContacts() {
    
    this.loading = true;

    const urlParams = this.getUrlParams();

    const expand = 'contactEmails,contactPhones,contactStats';

    this.companyContactService.list(this.currentPage, urlParams, expand).subscribe(response => {
      this.loading = false;
      this.companyContacts = response.body;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
    });
  }

  /**
   * infinite loader on scroll
   * @param event
   */
  doInfinite(event) {

    if(this.currentPage == this.pageCount) {
      event.target.complete();
      return null;
    }

    this.loading = true;

    this.currentPage++;

    const urlParams = this.getUrlParams();

    const expand = 'contactEmails,contactPhones,contactStats';

    this.companyContactService.list(this.currentPage, urlParams, expand).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.companyContacts = this.companyContacts.concat(response.body);
    },
    error => { },
    () => {
      this.loading = false;
      event.target.complete();
    });
  }

  /**
   * add new contact to company
   */
  async addCompanyContact() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const companyContact = new CompanyContact();
    companyContact.company_id = this.company.company_id;

    const modal = await this.modalCtrl.create({
      component: ModalPopPage,
      componentProps: {
        activatedRoutePath: CompanyContactFormPage,
        activatedRoutePathProps: {
          companyContact: companyContact
        }
      },
      cssClass: "popup-modal"
    });

    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadContacts();

        this.eventService.reloadStats$.next({
          company_id: this.company.company_id
        });
      }
    });
    modal.present();
  }

  doNothing(event) {
    event.preventDefault();
  }

  dismiss() {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss({ refresh: false });
      } else {
        this.navCtrl.back();
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  toggleOpen(companyContact, event) {
    event.preventDefault();
    event.stopPropagation();
    companyContact.isOpen = !companyContact.isOpen;
  }

  options() {

  }

  imageError() {
    this.company.company_logo = null;
  }

  /**
   * load company detail
   */
  loadCompanyDetail() {
    this.companyService.view(this.company.company_id, 'stats').subscribe(response => {
      this.company = response;
    }, () => {
    });
  }
}
