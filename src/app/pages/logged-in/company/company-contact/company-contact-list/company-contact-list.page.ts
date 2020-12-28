import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from "@ionic/angular";
//models
import { Company } from 'src/app/models/company';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';


@Component({
  selector: 'app-company-contact-list',
  templateUrl: './company-contact-list.page.html',
  styleUrls: ['./company-contact-list.page.scss'],
})
export class CompanyContactListPage implements OnInit {

  public company: Company;

  public contacts;

  public contactList = [];

  public currentPage: number;

  public pageCount: number;

  public loading: boolean = false;

  public query: string = '';

  public borderLimit = false;

  constructor(
    public companyContactService: CompanyContactService,
    public popupCtrl: PopoverController,
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
 
    if (this.company && this.company.companyContacts) 
    {
      this.contactList = this.company.companyContacts;
    } 
    else if (this.company) 
    {
      this.loadCompanyContacts();
    } else {
      this.loadData();//load all contacts if no company given
    }
  }

  /**
   * load company contacts
   */
  loadCompanyContacts() {
    this.loading = true;

    this.currentPage = 1;

    this.contactList = [];

    this.companyContactService.companyContacts(this.company.company_id, this.query).subscribe(response => {

      this.loading = false;

      this.contactList = response;
    },
    () => {
      this.loading = false;
    });
  }

  /**
   * load all contacts
   */
  loadData() {
    this.loading = true;

    this.currentPage = 1;

    this.contactList = [];

    this.companyContactService.list(this.currentPage, this.query).subscribe(response => {

      this.loading = false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.contactList = response.body;
    },
    () => {
      this.loading = false;
    });
  }

  /**
   * infinite loader on scroll
   * @param event
   */
  doInfinite(event) {
    this.loading = true;

    this.currentPage++;

    this.companyContactService.list(this.currentPage, this.query).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.contactList = this.contactList.concat(response.body);
    },
    error => { },
    () => {
      this.loading = false;
      event.target.complete();
    });
  }

  doNothing(event) {
    event.stopPropagation();
  }

  /**
   * close popup on selection
   * @param companyContact
   */
  dismiss(companyContact = null) {

    this.popupCtrl.getTop().then(overlay => {
      if(overlay) {
        this.popupCtrl.dismiss({ companyContact });
      } else {
        this.modalCtrl.dismiss({ companyContact });
      }
    });
  }

  /**
   * filter contacts
   * @param ev
   */
  filter(ev) {

    //filter from all companies

    if(!this.company) {
      return this.loadData();
    }

    //filter from given company

    this.loading = true;

    this.contactList = [];

    this.companyContactService.companyContacts(this.company.company_id, this.query).subscribe(response => {
      this.loading = false;

      this.contactList = response;
    }, () => {
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
