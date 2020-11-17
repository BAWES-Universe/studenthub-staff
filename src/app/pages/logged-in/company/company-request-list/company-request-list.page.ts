import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// models
import { Company } from 'src/app/models/company';
import { Request } from 'src/app/models/request';
// services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';

@Component({
  selector: 'app-company-request-list',
  templateUrl: './company-request-list.page.html',
  styleUrls: ['./company-request-list.page.scss'],
})
export class CompanyRequestListPage implements OnInit {

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
  } = {
      companyName: null,
      requestStatus: null,
      startDate: null,
      endDate: null
    };

  public min; // min date
  public max; // max date

  public borderLimit = false;
  
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public companyService: CompanyService,
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
  }

  ionViewWillEnter() {
    this.list(this.currentPage);
  }

  /**
   * list all requests
   * @param page 
   */
  async list(page: number) {

    this.loading = true;

    const urlParams = this.urlParams();

    this.requestService.listWithPagination(page, urlParams).subscribe(response => {

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

    return urlParams;
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  resetFilter() {
    this.filters = {
      companyName: null,
      requestStatus: null,
      startDate: null,
      endDate: null
    };
  }

  /**
   * open request detail page
   * @param $event 
   * @param request 
   */
  async viewRequest($event, request) {
    this.router.navigate(['request-view', request.request_uuid], {
      state: {
        model: request,
        from: 'company-request-list'
      }
    });
  }

  /**
   * open request form to edit
   * @param $event 
   * @param request 
   */
  async editRequest($event, request) {
    $event.preventDefault();
    $event.stopPropagation();
    this.router.navigate(['request-form', request.request_uuid], {
      state: {
        model: request
      }
    });
  }

  /**
   * mark request as started
   * @param event 
   * @param request 
   */
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

  /**
   * mark request as cancelled
   * @param event 
   * @param request 
   */
  cancelledRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Feedback'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Save',
          handler: (data) => {
            if (data.feedback) {
              request.request_feedback = data.feedback;
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
            } else {
              this.alertCtrl.create({
                message: 'Please provide feedback',
                buttons: ['ok']
              }).then(alert => {
                alert.present();
              });
            }
          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  /**
   * mark request as delivered
   * @param event 
   * @param request 
   */
  deliveredRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Feedback'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data) => {
            if (data.feedback) {
              request.request_feedback = data.feedback;
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
            } else {
              this.alertCtrl.create({
                message: 'Please provide feedback',
                buttons: ['ok']
              }).then(alert => {
                alert.present();
              });
            }
          }
        }
      ]
    }).then(alert => { alert.present(); });
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
