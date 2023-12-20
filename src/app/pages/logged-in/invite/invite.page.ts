import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
import { Request, Story } from 'src/app/models/request';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
// services
import { CompanyRequestService } from '../../../providers/logged-in/company-request.service';


@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  public borderLimit = false;

  public loadingRequests = false;

  public loading = false;

  public candidate: Candidate;

  public pageCount = 0;
  public currentPage = 1;
  public total = 0;

  public activeRequests: Request[] = [];
  public activeRequestsData: Request[] = [];

  public form: FormGroup;

  public query;

  public story: Story;
  public filters: {
    companyName: string,
    requestStatus: string,
  } = {
    companyName: null,
    requestStatus: null,
  };

  constructor(
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public eventService: EventService,
    public invitationService: InvitationService,
    public requestService: CompanyRequestService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Invite Page');

    this.initForm();
    this.loadRequests();
  }

  initForm() {

    this.form = this.fb.group({
      request_uuid: ['', Validators.required],
      candidate_id: [this.candidate ? this.candidate.candidate_id : null],
      reason: ['', Validators.required],
      story_uuid: this.story?.story_uuid
    });
  }

  async selectRequest(request) {
      const confirm = await this.alertCtrl.create({
        header: 'Please provide feedback',
        inputs: [
          {
            name: 'feedback',
            type: 'textarea',
            placeholder: 'Reason'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // Handle the functionality when user click on 'cancel' button
            }
          },
          {
            text: 'Ok',
            handler: async (data) => {
              this.form.controls['reason'].setValue(data.feedback);
              this.form.controls['request_uuid'].setValue(request.request_uuid);
              this.form.controls['request_uuid'].markAsDirty();
              this.save();
            }
          }
        ]
      });
      confirm.present();
  }

  /**
   * load all requests for parttimers
   */
  loadRequests() {

    this.loadingRequests = true;

    const urlParams = '&expand=storyOwners,staffs,staff,company&query=' + this.query;
    
    this.requestService.listWithPagination(1, urlParams).subscribe(response => {

      this.activeRequests = response.body;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.loadingRequests = false;

    }, () => {
      this.loadingRequests = false;
    });
  }

  onSearchInput(ev: any) {
    this.query = ev.target.value;

    const urlParams = '&expand=storyOwners,staffs,staff,company&query=' + this.query;

    //const urlParams = '&expand=storyOwners,staffs,staff,requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,' +
    // 'requestActivities,requestActivities.staff&query=' + this.query;

    this.loadingRequests = true;

    this.requestService.listWithPagination(1, urlParams).subscribe(response => {

      this.activeRequests = response.body;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.loadingRequests = false;

    }, () => {
      this.loadingRequests = false;
    });
  }


  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    return (date) ? new Date(date.replace(/-/g, '/')) : null;
  }

  /**
   * save suggestion
   */
  save() {
    this.loading = true;

    this.invitationService.create(this.form.value).subscribe(async response => {

      this.loading = false;

      // On Success
      if (response.operation == 'success') {
        // Close the page

        this.toastCtrl.create({
          message: this.authService.errorMessage(response.message),
          duration: 3000
        }).then(toast => {
          toast.present();
        });

        this.close(true, response.invitedCount);
      }

      // On Failure
      if (response.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();
      }
    }, () => {
      this.loading = false;
    });
  }

  /**
   * close popup
   * @param refresh
   * @param invitedCount
   */
  close(refresh = false, invitedCount = null) {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({
          refresh,
          invitedCount
        });
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {
    this.loadingRequests = true;

    this.currentPage++;
    this.requestService.listActiveWithPages(this.currentPage).subscribe(response => {
        this.activeRequests = this.activeRequests.concat(response.body);
        this.activeRequestsData = this.activeRequestsData.concat(response.body);
        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
      },
      error => { },
      () => {
        this.loadingRequests = false;
        event.target.complete();
      }
    );
  }
}
