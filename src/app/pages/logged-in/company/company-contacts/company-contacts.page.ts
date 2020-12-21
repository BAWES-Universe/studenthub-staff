import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { CompanyContact } from 'src/app/models/company-contact';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
//pages
import { CompanyContactFormPage } from '../company-contact-form/company-contact-form.page';
import {Company} from "../../../../models/company";
import {CompanyService} from "../../../../providers/logged-in/company.service";

@Component({
  selector: 'app-company-contacts',
  templateUrl: './company-contacts.page.html',
  styleUrls: ['./company-contacts.page.scss'],
})
export class CompanyContactsPage implements OnInit {

  public companyContacts: CompanyContact[] = [];
  public company_id;
  public company: Company;
  public borderLimit: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public companyContactService: CompanyContactService,
    public companyService: CompanyService
  ) { }

  ngOnInit() {

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    // const state = window.history.state;

    this.loadContacts();
    this.loadCompanyDetail();
  }

  loadContacts() {
    this.companyContactService.companyContacts(this.company_id).subscribe(data => {
      this.companyContacts = data;
    });
  }

  async addCompanyContact() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const companyContact = new CompanyContact;
    companyContact.company_id = this.company_id;

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
    this.companyService.view(this.company_id).subscribe(response => {
      this.company = response;
    }, () => {
    });
  }
}
