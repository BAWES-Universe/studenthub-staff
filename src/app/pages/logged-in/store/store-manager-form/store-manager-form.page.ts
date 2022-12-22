import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
//models
import { CompanyContact } from 'src/app/models/company-contact';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import {Contact} from "../../../../models/contact";


@Component({
  selector: 'app-store-manager-form',
  templateUrl: './store-manager-form.page.html',
  styleUrls: ['./store-manager-form.page.scss'],
})
export class StoreManagerFormPage implements OnInit {

  public company;

  public companyContacts: Contact[] = [];

  public parentCompanyContacts: Contact[] = [];

  public loading: boolean = false;
  
  public directView = false;

  public borderLimit = false;

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    public comapnyContactService: CompanyContactService
  ) { }

  ngOnInit() {
    
    if (this.navParams && this.navParams.data && this.navParams.data['view']) {
      this.directView = true;
    }
    window.analytics.page('Store Manager Form Page');

    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.comapnyContactService.companyContacts(this.company.company_id).subscribe(data => {
      this.loading = false;

      this.companyContacts = data;
    });

    if(this.company.parent_company_id) {
      this.comapnyContactService.companyContacts(this.company.parent_company_id).subscribe(data => {
        this.parentCompanyContacts = data;
      });
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  rowSelected(companyContact) {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: true, storeManager: companyContact });
      }
    });
  }

  dismiss(event = null) {
    this.modalCtrl.getTop().then(o => {
      if(o) {

        if(event) {
          event.preventDefault();
          event.stopPropagation();
        }

        this.modalCtrl.dismiss();      
      }
    });
  }
}
