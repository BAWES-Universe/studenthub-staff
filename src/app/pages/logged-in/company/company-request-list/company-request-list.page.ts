import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
  CalendarComponentOptions
} from 'ion2-calendar';

// models
import { Company } from 'src/app/models/company';
import { Request } from 'src/app/models/request';
// services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-company-request-list',
  templateUrl: './company-request-list.page.html',
  styleUrls: ['./company-request-list.page.scss'],
})
export class CompanyRequestListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public companies: Company[] = [];

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public requests: Request[] = [];

  public filters: {
    companyName: string,
    requestStatus: string,
    startDate: string
    endDate: string
    position_type: number
  } = {
      companyName: null,
      requestStatus: null,
      startDate: null,
      endDate: null,
      position_type: null
  };

  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
    // pickMode: 'multi'
  };
  public min; // min date
  public max; // max date

  public borderLimit = false;

  public scrollPosition = 0;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public companyService: CompanyService,
    public eventService: EventService,
    public requestService: CompanyRequestService,
    public aws: AwsService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
    this.min = '1930/01/01';

    const d = new Date();
    this.max = (this.platform.is('mobile')) ? d.getFullYear() + '-12-12' : d;

    this.list();

    this.eventService.companyRequestUpdate$.subscribe(() => {
      this.list();
    });
  }

  ionViewWillEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  /**
   * list all requests
   */
  async list() {

    this.loading = true;

    const urlParams = this.urlParams();

    this.requestService.listWithPagination(1, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    const urlParams = this.urlParams();

    this.requestService.listWithPagination(this.currentPage, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = this.requests.concat(response.body);
    },
      error => { },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '';

    if (this.filters.companyName) {
      urlParams += '&company_name=' + this.filters.companyName;
    }

    if (this.filters.requestStatus) {
      urlParams += '&request_status=' + this.filters.requestStatus;
    }

    if (this.filters.startDate) {
      urlParams += '&start_date=' + this.filters.startDate;
    }
    if (this.filters.endDate) {
      urlParams += '&end_date=' + this.filters.endDate;
    }

    if (this.filters.position_type) {
      urlParams += '&position_type=' + this.filters.position_type;
    }

    return urlParams;
  }

  resetFilter() {
    this.filters = {
      companyName: null,
      requestStatus: null,
      startDate: null,
      endDate: null,
      position_type: null
    };
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  requestDetail(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state : {
        from: 'company-request-list'
      }
    });
  }

  async selectDate(startDate = true) {
    const options: CalendarModalOptions = {
      title: 'Select Date',
      canBackwardsSelected: true,
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    if (date) {
      if (startDate) {
        this.filters.startDate = event.data.string;
        this.list(); // reload all result
      } else {
        this.filters.endDate = event.data.string;
        this.list(); // reload all result
      }
    }
  }

  filterByStatus($event, status) {
    this.filters.requestStatus = status;
    this.list(); // reload all result
  }

  filterByType($event, type) {
    this.filters.position_type = type;
    this.list(); // reload all result
  }

  searchByName($event) {
    this.filters.companyName = $event.detail.value;
    this.list(); // reload all result
  }

  /**
   * clear selected date filter
   * @param start
   */
  clearfilter(start = false) {
    if (start){
      this.filters.startDate = null;
    } else  {
      this.filters.endDate = null;
    }
    this.list(); // reload all result
  }
}
