import {Component, Input, OnInit} from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
// model
import { Company } from 'src/app/models/company';
// service
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-company-filter',
  templateUrl: './company-filter.page.html',
  styleUrls: ['./company-filter.page.scss'],
})
export class CompanyFilterPage implements OnInit {

  public borderLimit = false;
  public total = 0;
  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadingMore = false;
  public active = 1;
  public inActive = 0;
  public companies: Company[] = [];
  public segment = 1;

  public filters: {
    name: string
    status: number,
    approved_to_hire: number,
    have_students: number,
    withStats: boolean,
    staff_id: number
  } = {
      name: null,
      status: 5,
      approved_to_hire: null,
      have_students: null,
      withStats: false,
      staff_id: null
    };

  constructor(
    public navCtrl: NavController,
    public companyService: CompanyService,
    public platform: Platform,
    public authService: AuthService,
    public eventService: EventService,
    public _modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    /*this.eventService.reloadCandidateHistory$.subscribe(response => {
      this.loadData(1);
    });

    this.eventService.reloadCompanyList$.subscribe(response => {
      this.loadData(1);
    });*/
  }

  ionViewWillEnter() {
   // this.loadData(1);
  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '';
 
    if (this.filters.staff_id) {
      urlParams += '&staff_id=' + this.filters.staff_id;
    }

    if (this.filters.name) {
      urlParams += '&name=' + this.filters.name;
    }

    if (this.filters.status) {
      urlParams += '&status=' + this.filters.status;
    }
 
    if ([0, 1].indexOf(this.filters.have_students) > -1) {
      urlParams += '&have_students=' + this.filters.have_students;
    }

    if ([0, 1].indexOf(this.filters.approved_to_hire) > -1) {
      urlParams += '&approved_to_hire=' + this.filters.approved_to_hire;
    }

    if (this.filters.withStats) {
      urlParams += '&expand=subCompanies,stores,transferInLast40Days,subCompanies.stores,brands';
    }

    return urlParams;
  }

  resetStatus() {
    this.filters = {
      name: this.filters.name,
      status: 100,
      approved_to_hire: null,
      have_students: null,
      withStats: this.filters.withStats,
      staff_id: this.filters.staff_id
    };

    this.loadData(1); // reload all result
  }

  /**
   * Reset question filter
   */
  resetFilter() {
    this.filters = {
      approved_to_hire: null,
      have_students: null,
      name: null,
      status: 100,
      withStats: false,
      staff_id: null
    };

    //this.loadData(1); // reload all result
  }

  async loadData(page: number) {

    // Load list of companies
    this.loading = true;

    const searchParams = this.urlParams();

    this.companyService.list(page, searchParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.companies = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model: Company) {
    this.navCtrl.navigateForward('company-view/' + model.company_id, {
      state: {
        model
      }
    });
  }

  segmentChanged($event) {
    this.segment = $event.detail.value;
  }

  loadLogo($event, company) {
    company.company_logo = null;
  }

  doInfinite(event) {

    this.loadingMore = true;
    this.currentPage++;

    const urlParams = this.urlParams();

    this.companyService.list(this.currentPage, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.companies = this.companies.concat(response.body);
    },
      error => { },
      () => {
        this.loadingMore = false;
        event.target.complete();
      }
    );
  }

  /**
   * Loads the create page
   */
  // async create() {
  //   window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
  //
  //   const modal = await this._modalCtrl.create({
  //     component: CompanyFormPage,
  //     componentProps: {
  //       model: new Company(),
  //       subcompany: 0
  //     }
  //   });
  //   // Refresh List if required
  //   modal.onDidDismiss().then(e => {
  //
  //     if (!e.data || e.data.from != 'native-back-btn') {
  //       window['history-back-from'] = 'onDidDismiss';
  //       window.history.back();
  //     }
  //
  //     if (e && e.data && e.data.refresh) {
  //       this.loadData(1);
  //     }
  //   });
  //   modal.present();
  // }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   *  "40 days passed without payment" functionality currently ("Active" + Has assigned staff + hasn't made any payment in 40 days)
   *  has issue for newly added company and just now assigned staff. We need to add rule to check if all above rules pass,
   *  we query for the oldest candidate assignment datetime assigned to that company,
   *  if its less than 40 days then no need to mark as  "40 days passed without payment"
   */

  candidateWorkHistoryByLast40Days(company) {
    if (company.company_status && !company.transferInLast40Days) {
      if (company.stores.length > 0) {
        return (company.stores.find(store => store.candidateWorkHistoryByLast40Days === true));
      }
      if (company.subCompanies.length > 0) {
        company.subCompanies.map(subCompany => {
          if (subCompany.stores.length > 0) {
            return (subCompany.stores.find(store => store.candidateWorkHistoryByLast40Days === true));
          }
        });
      }
    }
    return false;
  }

  filterByStaff($event, staff_id) {

    if (this.filters.staff_id == staff_id) {
      this.filters.staff_id = null;
    } else {
      this.filters.staff_id = staff_id;
    }

   // this.loadData(1); // reload all result
  }

  filterWithStats($event) {
    this.filters.withStats = !this.filters.withStats;
    
    //this.loadData(1); // reload all result
  }

  filterByStatus($event, status) {

    if(this.filters.status == status) {
      this.filters.status = null;
    } else {
      this.filters.status = status;
    }

    //this.loadData(1); // reload all result
  }

  filterByApprovedToHire($event, status) {

    if(this.filters.approved_to_hire == status) {
      this.filters.approved_to_hire = null;
    } else {
      this.filters.approved_to_hire = status;
    }

    //this.loadData(1); // reload all result
  }

  filterByHaveStudents($event, status) {

    if(this.filters.have_students == status) {
      this.filters.have_students = null;
    } else {
      this.filters.have_students = status;
    }

    //this.loadData(1); // reload all result
  }

  searchByName($event) {
    this.filters.name = $event.detail.value;
    //this.loadData(1); // reload all result
  }

  close() {
    this._modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: false });
      }
    });
  }

  fetchResult() {
    this._modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: true, filter: this.filters });
      }
    });
  }
}

