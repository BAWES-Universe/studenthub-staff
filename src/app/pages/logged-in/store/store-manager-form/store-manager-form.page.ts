import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//models
import { CompanyContact } from 'src/app/models/company-contact';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';


@Component({
  selector: 'app-store-manager-form',
  templateUrl: './store-manager-form.page.html',
  styleUrls: ['./store-manager-form.page.scss'],
})
export class StoreManagerFormPage implements OnInit {

  public company; 

  public companyContacts: CompanyContact[] = [];
  
  public parentCompanyContacts: CompanyContact[] = [];

  public loading: boolean = false; 

  constructor(
    public modalCtrl: ModalController,
    public comapnyContactService: CompanyContactService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.comapnyContactService.companyContacts(this.company.company_uuid).subscribe(data => {
      this.loading = false;

      this.companyContacts = data;
    });

    if(this.company.parent_company_id) {
      this.comapnyContactService.companyContacts(this.company.parent_company_id).subscribe(data => {
        this.parentCompanyContacts = data;
      });
    }
  }

  rowSelected(companyContact) {
    this.modalCtrl.dismiss({
      refresh: true,
      storeManager: companyContact
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
