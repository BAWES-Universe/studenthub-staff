import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { CompanyContact } from 'src/app/models/company-contact';
import { Company } from "../../../../models/company";
//services
import { CompanyService } from "../../../../providers/logged-in/company.service";
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { EventService } from 'src/app/providers/event.service';
//pages
import { CompanyContactRolePage } from '../company-contact-role/company-contact-role.page';
import { ModalPopPage } from '../../modal-pop/modal-pop.page';


@Component({
  selector: 'app-company-contacts',
  templateUrl: './company-contacts.page.html',
  styleUrls: ['./company-contacts.page.scss'],
})
export class CompanyContactsPage implements OnInit {

  public companyContacts: CompanyContact[] = [];

  public company: Company;
  
  public borderLimit: boolean = false;

  public loading = false;

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public companyContactService: CompanyContactService,
    public companyService: CompanyService,
    public eventService: EventService
  ) { }

  ngOnInit() {

    this.loadContacts();

    if (!this.company)
      this.loadCompanyDetail();
  }

  /**
   * open contact detail page
   * @param companyContact
   */
  async openContactDetail(companyContact) {
    this.modalCtrl.dismiss().then(() => {
      setTimeout(() => {
        this.router.navigate(['company-contact-view', companyContact.contact_uuid, this.company.company_id], {
          state: {
            model: companyContact
          }
        });
      }, 100);
    });
    /*
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

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

  loadContacts() {
    this.loading = true;
    this.companyContactService.companyContacts(this.company.company_id, ' ', 'contactEmails,contactPhones,contactStats').subscribe(data => {
      this.loading = false;
      this.companyContacts = data;
    });
  }

  /**
   * add new contact to company 
   */
  async addCompanyContact() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const companyContact = new CompanyContact;
    companyContact.company_id = this.company.company_id;

    const modal = await this.modalCtrl.create({
      component: ModalPopPage,
      componentProps: {
        activatedRoutePath: CompanyContactRolePage,
        activatedRoutePathProps: {
          companyContact: companyContact
        }
      }
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
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
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
