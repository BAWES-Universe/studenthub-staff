import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { CompanyContact } from 'src/app/models/company-contact';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
//pages
import { CompanyContactFormPage } from '../company-contact-form/company-contact-form.page';
import {Company} from "../../../../models/company";
import {CompanyService} from "../../../../providers/logged-in/company.service";
import { CompanyContactViewPage } from '../company-contact/company-contact-view/company-contact-view.page';

@Component({
  selector: 'app-company-contacts',
  templateUrl: './company-contacts.page.html',
  styleUrls: ['./company-contacts.page.scss'],
})
export class CompanyContactsPage implements OnInit {

  public companyContacts: CompanyContact[] = [];

  public company: Company;
  public borderLimit: boolean = false;

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public companyContactService: CompanyContactService,
    public companyService: CompanyService
  ) { }

  ngOnInit() {

    this.loadContacts();

    if(!this.company)
      this.loadCompanyDetail();
  }

  /**
   * open contact detail page 
   * @param companyContact 
   */
  async openContactDetail(companyContact) {
    this.modalCtrl.dismiss().then(() => {
      setTimeout(() => {
        this.router.navigate(['company-contact-view', companyContact.contact_uuid], {
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
    this.companyContactService.companyContacts(this.company.company_id).subscribe(data => {
      this.companyContacts = data;
    });
  }

  async addCompanyContact() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const companyContact = new CompanyContact;
    companyContact.company_id = this.company.company_id;

    const modal = await this.modalCtrl.create({
      component: CompanyContactFormPage,
      componentProps: {
        model: companyContact
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadContacts();
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
    this.companyService.view(this.company.company_id).subscribe(response => {
      this.company = response;
    }, () => {
    });
  }
}
