import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

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

  ngOnInit() {}

  ionViewWillEnter() {
    this.list(this.currentPage);
  }

  async list(page: number) {
    // Load list of companies
    this.loading = true;

    this.requestService.listWithPagination(page).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.requests = response.body;
      },
      error => {},
      () => {this.loading = false; }
    );
  }

  doInfinite(event) {

    this.loading = true;
    this.currentPage++;

    this.requestService.listWithPagination(this.currentPage).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.requests = this.requests.concat(response.body);
      },
      error => {},
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
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

  async viewRequest($event, request) {
    this.router.navigate(['request-view', request.request_uuid], {
      state: {
        model: request,
        from: 'company-request-list'
      }
    });
  }

  async editRequest($event, request) {
    $event.preventDefault();
    $event.stopPropagation();
    this.router.navigate(['request-form', request.request_uuid], {
      state: {
        model: request
      }
    });
  }

  async addRequest($event) {
    this.router.navigate(['request-form']);
  }

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
            } else  {
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
    }).then( alert => { alert.present(); });
  }

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
            } else  {
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
    }).then( alert => { alert.present(); });

  }

  loadLogo($event, company) {
    company.company_logo = null;
  }
}
