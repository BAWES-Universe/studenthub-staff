import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  AlertController,
  ToastController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  IonContent,
  PopoverController
} from '@ionic/angular';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { RequestActivityService } from 'src/app/providers/logged-in/request.activity.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { EventService } from 'src/app/providers/event.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
// models
import { Request, Story } from 'src/app/models/request';
import { Note } from 'src/app/models/note';
import { Fulltimer } from "../../../../models/fulltimer";
import { Invitation } from 'src/app/models/invitation';
// pages
import { CompanyNoteFormPage } from '../company-note-form/company-note-form.page';
import { CompanyRequestFormPage } from '../company-request-form/company-request-form.page';
import { FulltimerSearchPage } from '../../fulltimer/fulltimer-search/fulltimer-search.page';
import { StaffPage } from '../../pickers/staff/staff.page';
import { RequestOptionPage } from './company-request-option.page';
import {StoryService} from "../../../../providers/logged-in/story.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { Candidate } from 'src/app/models/candidate';
import { RequestApplication } from 'src/app/models/request-application';


@Component({
  selector: 'app-company-request-view',
  templateUrl: './company-request-view.page.html',
  styleUrls: ['./company-request-view.page.scss'],
})
export class CompanyRequestViewPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public request: Request;
  public requestActivities: Note[] = [];

  public allInvitedCandidates = [];

  public allSuggestions = [];

  public suggestedSuggestions = [];

  public acceptedSuggestions = [];

  public rejectedSuggestions = [];

  public invitedCandidates: Invitation[] = [];

  public rejectedCandidates: Invitation[] = [];

  public acceptedInvitations: Invitation[] = [];

  public section = 'invited';
  public request_uuid;
  public loading = false;
  public loadingInvoice = false;
  public loadingActivities = false;
  public pickingUp = false;
  public updatingInterval = false;

  public borderLimit = false;
  public backState = null;

  public activityExpanded: boolean = false;

  public alertRequestUpdated: boolean = false;

  public internvalSubscribe;

  public segment: string = 'details';
 
  public IPageCount = 0;
  public IcurrentPage = 0;
  public Itotal = 0;
  public SPageCount = 0;
  public ScurrentPage = 0;
  public Stotal = 0;

  public matchedCandidates: Candidate[] = [];
  public MPageCount = 0;
  public McurrentPage = 0;
  public Mtotal = 0;

  public loadingMatched:boolean = false;

  public loadingApplications: boolean = false; 

  public candidateApplications: RequestApplication[] = [];
  
  public applicationPageCount = 0;
  public applicationCurrentPage  = 0;
  public applicationTotal = 0;

  constructor(
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public route: ActivatedRoute,
    public authService: AuthService,
    public candidateService: CandidateService,
    public requestService: CompanyRequestService,
    public requestActivityService: RequestActivityService,
    public navCtrl: NavController,
    public location: Location,
    public suggestionService: SuggestionService,
    public invitationService: InvitationService,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public platform: Platform,
    public storyService: StoryService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Company Request View Page');

    if (!this.request_uuid)
      this.request_uuid = this.route.snapshot.params['request_uuid'];

    this.backState = window.history.state;
    const model = window.history.state.model;

    this.loadDetail();
    this.loadRequestActivities();
    this.loadSuggestions();
    this.loadInvitations();
    this.loadApplications();

    this.eventService.companyRequestUpdate$.subscribe((data: any) => {
      if (data && data.request_uuid == this.request_uuid) {
        if(data.refresh) {
          this.loadDetail();
        } else {
          this.request.request_updated_datetime = data.request_updated_datetime;
        }
      }
    });

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if (data && data.request_uuid == this.request_uuid) {
        this.loadRequestActivities();
      }
    });

    this.internvalSubscribe = setInterval(_ => {
      this.isRequestUpdated();
    }, 6 * 1000);//every 6 seconds
  }

  ngOnDestroy() {
    clearInterval(this.internvalSubscribe);
    this.internvalSubscribe = null;
  }

  /**
   * list invoices
   */
  listInvoice() {
    this.loadRequestActivities();
  }

  /**
   * close this modal
   */
  dismiss() {
    this.location.back();
  }

  /**
   * load request detail
   */
  loadDetail(loading = true) {

    //hide update alert

    this.alertRequestUpdated = false;

    if (loading)
      this.loading = true;

    const urlParams = '?expand=nationality,storyOwners,staffs,staff,contact,company,stories,stories.staff,' +
      'requestSkills';//newApplicationCount,activeSuggestionCount

    this.requestService.view(this.request_uuid, urlParams).subscribe(data => {

      this.request = data;

    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  /**
   * check if request updated, if so reload details
   */
  isRequestUpdated() {

    if (!this.request || this.alertRequestUpdated) {
      return null;
    }

    this.requestService.isRequestUpdated(this.request_uuid).subscribe(data => {
      if (data.request_updated_datetime != this.request.request_updated_datetime && !this.loading) {
        //this.loadDetail(false);//refresh without showing loader
        this.alertRequestUpdated = true;
      }
      this.loading = false;
    });
  }

  closeAlert() {
    this.alertRequestUpdated = false;
  }

  /**
   * toggle activity visiblities
   */
  toggleActivityExpanded() {
    this.activityExpanded = !this.activityExpanded;
  }

  /**
   * load invitations for this request
   */
  loadInvitations(loading = true) {

    const params = '?expand=candidate,note,story&request_uuid=' + this.request_uuid;

    this.invitationService.listWithPagination(params).subscribe(invitations => {

      this.allInvitedCandidates = invitations.body;
      this.IPageCount = parseInt(invitations.headers.get('X-Pagination-Page-Count'));
      this.IcurrentPage = parseInt(invitations.headers.get('X-Pagination-Current-Page'));
      this.Itotal = parseInt(invitations.headers.get('X-Pagination-Total-Count'));

      // this.invitedCandidates = invitations.body.filter(invitation => invitation.invitation_status == 1);
      // this.rejectedCandidates = invitations.body.filter(invitation => invitation.invitation_status == 2);
      // this.acceptedInvitations = invitations.body.filter(invitation => invitation.invitation_status == 3);
    });
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  async doInfinite(event) {

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();

    this.IcurrentPage++;

    const urlParams = '?expand=candidate,note,story&request_uuid=' + this.request_uuid + '&page=' + this.IcurrentPage;
    
    this.invitationService.listWithPagination(urlParams).subscribe(invitations => {

        this.IPageCount = parseInt(invitations.headers.get('X-Pagination-Page-Count'));
        this.IcurrentPage = parseInt(invitations.headers.get('X-Pagination-Current-Page'));
        this.Itotal = parseInt(invitations.headers.get('X-Pagination-Total-Count'));

        this.allInvitedCandidates = this.allInvitedCandidates.concat(invitations.body);
        //
        // this.invitedCandidates = invitations.body.filter(invitation => invitation.invitation_status == 1);
        // this.rejectedCandidates = invitations.body.filter(invitation => invitation.invitation_status == 2);
        // this.acceptedInvitations = invitations.body.filter(invitation => invitation.invitation_status == 3);

      },
      error => { },
      () => {
        this.loading = false;
        loading.dismiss();
        event.target.complete();
      }
    );
  }

  /**
   * On Invitation moved to suggestion
   */
  onInvitationUpdated() {
    //this.loadInvitations();
    this.loadSuggestions();
  }

  /**
   * load request detail
   */
  loadRequestActivities() {
    this.loadingActivities = true;
    this.requestActivityService.list(this.request_uuid).subscribe(data => {
      this.requestActivities = data;
    }, () => {
    }, () => {
      this.loadingActivities = false;
    });
  }

  candidateSelected(candidate) {
    this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
      state: {
        request: this.request
      }
    });
  }

  staffSelected(staff) {
    this.navCtrl.navigateForward('team-view/' + staff.staff_id, {
      state: {
        model: staff
      }
    });
  }

  storySelected(story) {
    this.navCtrl.navigateForward('story-view/' + story.story_uuid);
  }

  /**
   * load candidate suggestions for this request
   */
  loadSuggestions() {

    const params = '&request_uuid=' + this.request_uuid;

    this.suggestionService.list(1, params).subscribe(data => {

      this.allSuggestions = data.body;
      this.SPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.ScurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.Stotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
    });
  }

  onSuggestionUpdate() {
    this.loadSuggestions();
    this.loadRequestActivities();
    this.content.scrollToPoint(0, 0);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date)
      return null;

    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  /**
   * open popup to select consultants
   */
  async assign() {

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StaffPage,
      componentProps: {
        role: 2 //only consultants
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.staff_id) {

      this.requestService.assign(this.request_uuid, data.staff_id).subscribe(async res => {

        if (res.operation == 'success') {
          this.request.staff = res.staff;
        }
        else {
          this.alertCtrl.create({
            message: this.translateService.errorMessage(res.message),
            buttons: ['Okay']
          }).then(prompt => {
            prompt.present();
          });
        }
      });
    }
  }

  /**
   * show alert to post update on request
   */
  async showUpdateAlert() {

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const note = new Note();
    note.request_uuid = this.request_uuid;
    note.company_id = this.request.company_id;
    note.contact_uuid = this.request.contact_uuid;

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note: note,
        from: 'post-update'
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadRequestActivities();

      this.request.request_updated_datetime = data.request_updated_datetime;

      this.eventService.companyRequestUpdate$.next({
        company_id: this.request.company_id,
        request_updated_datetime: data.request_updated_datetime,
        request_uuid: this.request_uuid
      });
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0);
  }

  /**
   * update request
   */
  async update() {
    this.navCtrl.navigateForward(['request-form', this.request_uuid]);
    /*
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyRequestFormPage,
      componentProps: {
        request: this.request,
        company: this.request.company,
      },
      cssClass: "popup-modal"
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {

        this.loadDetail(false);
      }
    });
    modal.present();*/
  }

  /**
   * mark request as cancelled
   * @param event
   * @param request
   */
  cancelledRequest(event, request) {

    if (this.suggestedSuggestions.length > 0) {
      this.toastCtrl.create({
        message: 'Please clear all suggestions by accepting or rejecting before being able to proceed with mark delivered / cancellation',
        buttons: ['Okay']
      }).then(prompt => {
        prompt.present();
      });
      return false;
    }

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

            if (!data.feedback) {
              this.alertCtrl.create({
                message: 'Please provide feedback',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
            }

            request.request_feedback = data.feedback;

            this.requestService.cancel(request).subscribe(async response => {

              if (response.operation == 'success') {

                request.request_status = 'cancelled';

                this.loadRequestActivities();

                this.eventService.reloadStats$.next({
                  company_id: this.request.company_id
                });

                this.eventService.companyRequestCancelled$.next({
                  company_id: this.request.company_id,
                  request_updated_datetime: response.request_updated_datetime,
                  request_uuid: this.request_uuid
                });

                this.eventService.companyRequestUpdate$.next({
                  company_id: this.request.company_id,
                  request_updated_datetime: response.request_updated_datetime,
                  request_uuid: this.request_uuid
                });

              } else {

                this.toastCtrl.create({
                  message: this.translateService.errorMessage(response.message),
                  buttons: ['Okay']
                }).then(prompt => {
                  prompt.present();
                });
              }
            });

          }
        }
      ]
    }).then(alert => { alert.present(); });
  }


  updateValue(event) {

    this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'hours',
          type: 'text',
          placeholder: 'Hours'
        },
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Reason'
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

            if (!(data.feedback.trim()) || !(data.hours.trim())) {
              this.alertCtrl.create({
                message: 'Please provide hours & feedback',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
            } else {
              this.updatingInterval = true;

              const params = {
                request_uuid: this.request_uuid,
                num_hours_followup_interval: data.hours,
                reason: data.feedback,
              };

              this.requestService.updateInterval(params).subscribe(async response => {
                this.updatingInterval = false;
                if (response.operation == 'success') {

                  this.request.num_hours_followup_interval = data.hours;

                  this.loadRequestActivities();

                  this.eventService.companyRequestUpdate$.next({
                    company_id: this.request.company_id,
                    request_updated_datetime: response.request_updated_datetime,
                    request_uuid: this.request_uuid
                  });

                } else {

                  this.toastCtrl.create({
                    message: this.translateService.errorMessage(response.message),
                    buttons: ['Okay']
                  }).then(prompt => {
                    prompt.present();
                  });
                }
              });
            }
          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  /**
   * view request detail page
   * @param e
   */
  async openPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: RequestOptionPage,
      componentProps: {
        request: this.request
      },
      event: e
    });
    popover.present();
    popover.onDidDismiss().then(e => {
      if (!e.data)
        return null;

      if(e.data.action == 'update') {
        this.update();
      } else if(e.data.action == 'cancel') {
        this.cancelledRequest(e, this.request);
      } else if(e.data.action == 'rework') {
        this.statusUpdate(null, 're_work');
      } else if(e.data.action == 'create_story') {
        this.createStory();
      }
    });
  }

  /**
   * mark request as delivered
   * @param event
   * @param request
   */
  deliveredRequest(event, request) {

    if (this.suggestedSuggestions.length > 0) {
      this.toastCtrl.create({
        message: 'Please clear all suggestions by accepting or rejecting before being able to proceed with mark delivered / cancellation',
        buttons: ['Okay']
      }).then(prompt => {
        prompt.present();
      });
      return false;
    }

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

            if (!data.feedback) {
              this.alertCtrl.create({
                message: 'Please provide feedback',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
            }

            request.request_feedback = data.feedback;

            this.requestService.deliver(request).subscribe(async response => {

              if (response.operation == 'success') {
                request.request_status = 'delivered';
                this.loadRequestActivities();

                this.eventService.reloadStats$.next({
                  company_id: this.request.company_id
                });

                this.eventService.companyRequestUpdate$.next({
                  company_id: this.request.company_id,
                  request_updated_datetime: response.request_updated_datetime,
                  request_uuid: this.request_uuid
                });

                this.eventService.companyRequestDelivered$.next({
                  company_id: this.request.company_id,
                  request_updated_datetime: response.request_updated_datetime,
                  request_uuid: this.request_uuid
                });

              } else {
                this.toastCtrl.create({
                  message: this.translateService.errorMessage(response.message),
                  buttons: ['Ok']
                }).then(prompt => {
                  prompt.present();
                });
              }
            });
          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  /**
   * select full timer
   * @param $event
   * @param fulltimer
   */
  async suggestCandidate($event, fulltimer: Fulltimer = new Fulltimer()) {
    $event.preventDefault();
    $event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerSearchPage,//FulltimerFormPage,
      componentProps: {
        request_uuid: this.request_uuid,
        model: fulltimer
      },
      cssClass: "popup-modal"
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
      if (e.data && e.data.refresh) {
        this.loadDetail();
      }

      if (e.data && e.data.fulltimer_uuid) {
        this.showSuggestionDialog(e.data.fulltimer_uuid);
      }
    });
    return await modal.present();
  }

  /**
   * show dialog to get reason for suggestion
   * @param fulltimer_uuid
   */
  async showSuggestionDialog(fulltimer_uuid) {
    const alert = await this.alertCtrl.create({
      header: 'Please provide reason for suggestion',
      inputs: [
        {
          name: 'suggestion',
          type: 'text',
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Submit',
          handler: async (data) => {
            if (!data.suggestion) {
              this.toastCtrl.create({
                message: this.authService.errorMessage('Reason for suggestion required'),
                duration: 3000
              }).then(toast => {
                toast.present();
              });
              return false;
            }

            this.createSuggestion(fulltimer_uuid, data.suggestion);
          }
        }
      ]
    });
    alert.present();
  }


  /**
   * creating suggestion
   * @param fulltimer_uuid
   */
  async createSuggestion(fulltimer_uuid, suggestion) {

    const params = {
      suggestion: suggestion,
      request_uuid: this.request_uuid,
      fulltimer_uuid,
      candidate_id: null
    };

    const loading = await this.loadingCtrl.create({
      message: 'Suggesting Please wait...',
      duration: 2000
    });
    loading.present();

    this.suggestionService.create(params).subscribe(async response => {

      this.loading = false;

      // On Success
      if (response.operation == 'success') {

        this.loadDetail();
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
    },
      () => {
        loading.dismiss();
      }
    );
  }

  segmentChanged(event) {

    if(this.segment != event.target.value)
      this.segment = event.target.value;

    if(this.segment == "matches") {
      if(this.matchedCandidates.length == 0) {
        this.loadMatched();
      }
    } else if(this.segment == "applied") {
      //if(this.candidateApplications.length == 0) {
        this.loadApplications();
      //}
    }
  }

  
  loadApplications() {
 
    this.loadingApplications = true;

    this.applicationCurrentPage = 1;

    this.requestService.listApplications(this.request_uuid, this.applicationCurrentPage).subscribe(data => {

      this.candidateApplications = data.body;
      this.applicationPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.applicationCurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.applicationTotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
    },
    () => { },
    () => {
      this.loadingApplications = false;
    });
  }

  /**
   * load more on scroll to bottom
   * @param event 
   */
  doInfiniteApplications(event) {

    this.loadingApplications = true;

    this.applicationCurrentPage++;

    this.requestService.listApplications(this.request_uuid, this.applicationCurrentPage).subscribe(data => {

      this.candidateApplications = data.body;
      this.applicationPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.applicationCurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.applicationTotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
    },
    () => { },
    () => {
      this.loadingApplications = false;
      event.target.complete();
    });
  }

  getTimeSpent(time) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let months = 0;
    seconds = time;
    if (seconds > 60) {
      minutes = (time / 60);
    }
    if (minutes > 60) {
      hours = (minutes / 60 );
    }
    if (hours > 24) {
      days = (hours / 24 );
    }
    if (days > 31) {
      months = (days / 31 );
    }

    if (months) {
      return months.toFixed(2) + ' months';
    }
    if (days) {
      return days.toFixed(2) + ' days';
    }
    if (hours) {
      return hours.toFixed(2) + ' hours';
    }
    if (minutes) {
      return minutes.toFixed(2) + ' minutes';
    }
    if (seconds) {
      return seconds.toFixed(2) + ' seconds';
    }

  }

  /**
   * update request status
   * @param event
   * @param status
   */
  statusUpdate(event, status = 're_work') {
    const title = (status == 're_work') ? 'Re-work' : 'Finished';
    this.alertCtrl.create({
      header: `Are you sure you want to set status as ${title}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: (data) => {
              this.request.request_status = (status == 're_work') ? 're_work' : 'finished_by_recruitment';
              this.updateStatus();
          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  /**
   * update status method
   */
  updateStatus() {
    this.requestService.statusUpdate(this.request).subscribe(async response => {
      this.toastCtrl.create({
        message: this.translateService.errorMessage(response.message),
        buttons: ['Okay']
      }).then(prompt => {
        prompt.present();
      });
    });
  }

  getStatus(request_status) {
    if (request_status == 're_work') {
      return 'Re-Work';
    } else if (request_status == 'finished_by_recruitment') {
      return 'Finished by recruitment';
    } else {
      return request_status;
    }
  }

  changeSection(sec) {
    this.section = sec;
  }

  /**
   * show dialog to get reason for suggestion
   * @param fulltimer_uuid
   */
  async createStory() {
    const alert = await this.alertCtrl.create({
      header: 'Provide number of employee for this story',
      inputs: [
        {
          placeholder: 'number of employers',
          name: 'employee',
          type: 'number',
          min: 1,
          max: 15,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Submit',
          handler: async (data) => {
            if (!data.employee) {
              this.toastCtrl.create({
                message: this.authService.errorMessage('Please provide employee'),
                duration: 3000
              }).then(toast => {
                toast.present();
              });
              return false;
            }

            this.createStoryForRequest(data.employee);
          }
        }
      ]
    });
    alert.present();
  }
  /**
   * creating request
   * @param employee
   */
  async createStoryForRequest(employee) {

    const params = {
      request_uuid: this.request_uuid,
      employee
    };

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();

    this.storyService.create(params).subscribe(async response => {

        this.loading = false;

        // On Success
        if (response.operation == 'success') {

          this.loadDetail();
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
      },
      () => {
        loading.dismiss();
      }
    );
  }

  loadMatched() {

    this.loadingMatched = true;

    this.McurrentPage = 1;

    this.candidateService.searchRequestMatch(this.request_uuid, this.McurrentPage).subscribe(data => {

      this.matchedCandidates = data.body;
      this.MPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.McurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.Mtotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
    },
    () => { },
    () => {
      this.loadingMatched = false;
    });
  }

  /**
   * load more matched candidates 
   * @param event 
   */
  doInfiniteMatched(event) {

    this.loadingMatched = true;
    
    this.McurrentPage++;

    this.candidateService.searchRequestMatch(this.request_uuid, this.McurrentPage).subscribe(data => {

      this.matchedCandidates = this.matchedCandidates.concat(data.body);
      this.MPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.McurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.Mtotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
    },
    () => { },
    () => {
      this.loadingMatched = false;
      event.target.complete();
    });
  }

  async doInfiniteSuggestion(event) {

    this.ScurrentPage++;

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();

    const params = '&request_uuid=' + this.request_uuid;

    this.suggestionService.list(this.ScurrentPage, params).subscribe(data => {

      this.allSuggestions = this.allSuggestions.concat(data.body);
      this.SPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.ScurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.Stotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
      },
      error => { },
      () => {
        this.loading = false;
        loading.dismiss();
        event.target.complete();
      }
    );
  }

  /**
   * refresh on pull to bottom
   * @param event 
   */
  doRefresh(event) {
    switch (this.segment) {
      case "details":
        this.loadDetail();
        break;
      case "activities":
        this.loadRequestActivities();
        break;
      case "stories":
        this.loadDetail();
        break;
      case "matches":
        this.loadMatched();
        break;
      case "invited":
        this.loadInvitations();
        break;
      case "applied":
        this.loadApplications();
        break;
      case "suggested":
        this.loadSuggestions();
        break;
      default:
        break;
    }
   
    event.target.complete();
  }
}
