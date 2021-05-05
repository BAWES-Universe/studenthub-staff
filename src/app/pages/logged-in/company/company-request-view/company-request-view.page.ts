import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  IonContent
} from '@ionic/angular';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { RequestActivityService } from 'src/app/providers/logged-in/request.activity.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { Request } from 'src/app/models/request';
import { Note } from 'src/app/models/note';
// pages
import { CompanyNoteFormPage } from '../company-note-form/company-note-form.page';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { Invitation } from 'src/app/models/invitation';
import { CompanyRequestFormPage } from '../company-request-form/company-request-form.page';
import {Fulltimer} from "../../../../models/fulltimer";
import {FulltimerFormPage} from "../../fulltimer/fulltimer-form/fulltimer-form.page";


@Component({
  selector: 'app-company-request-view',
  templateUrl: './company-request-view.page.html',
  styleUrls: ['./company-request-view.page.scss'],
})
export class CompanyRequestViewPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public request: Request;
  public requestActivities: Note[] = [];

  public suggestedSuggestions = [];

  public acceptedSuggestions = [];

  public rejectedSuggestions = [];

  public invitedCandidates: Invitation[] = [];

  public rejectedCandidates: Invitation[] = [];

  public acceptedInvitations: Invitation[] = [];

  public request_uuid;
  public loading = false;
  public loadingInvoice = false;
  public loadingActivities = false;
  public pickingUp = false;
  public updatingInterval = false;

  public borderLimit = false;
  public backState = null;

  public activityExpanded: boolean = false;

  public internvalSubscribe;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public route: ActivatedRoute,
    public authService: AuthService,
    public requestService: CompanyRequestService,
    public requestActivityService: RequestActivityService,
    public navCtrl: NavController,
    public location: Location,
    public suggestionService: SuggestionService,
    public invitationService: InvitationService,
    public eventService: EventService,
    public translateLabelService: TranslateLabelService,
    public platform: Platform
  ) {
  }

  ngOnInit() {

    if(!this.request_uuid)
      this.request_uuid = this.route.snapshot.params.request_uuid;

    this.backState = window.history.state;
    const model = window.history.state.model;

    this.loadDetail();

    this.eventService.companyRequestUpdate$.subscribe((data: any) => {
      if(data && data.request_uuid == this.request_uuid) {
        this.request.request_updated_datetime = data.request_updated_datetime;
      }
    });

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if(data && data.request_uuid == this.request_uuid) {
        this.loadRequestActivities();
      }
    });

    this.internvalSubscribe = setInterval(  _ => {
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

    if(loading)
      this.loading = true;

    this.requestService.view(this.request_uuid).subscribe(data => {
      this.request = data;
      this.loadRequestActivities();
      this.loadSuggestions();
      this.loadInvitations();
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  /**
   * check if request updated, if so reload details
   */
  isRequestUpdated() {
    if(!this.request) {
      return null;
    }

    this.requestService.isRequestUpdated(this.request_uuid).subscribe(data => {
      if(data.request_updated_datetime != this.request.request_updated_datetime) {
        this.loadDetail(false);//refresh without showing loader
      }
    }, () => {
    }, () => {
      this.loading = false;
    });
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
  loadInvitations(loading = true)
  {
    this.invitationService.list('&request_uuid=' + this.request_uuid).subscribe(invitations => {

      this.invitedCandidates = invitations.filter(invitation => invitation.invitation_status == 1);

      this.rejectedCandidates = invitations.filter(invitation => invitation.invitation_status == 2);

      this.acceptedInvitations = invitations.filter(invitation => invitation.invitation_status == 3);
    })
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

  /**
   * load candidate suggestions for this request
   */
  loadSuggestions() {

    const params = '&request_uuid=' + this.request_uuid;

    this.suggestionService.list(params).subscribe(data => {

      this.suggestedSuggestions = [];

      this.acceptedSuggestions = [];

      this.rejectedSuggestions = [];

      data.forEach(element => {
        if (element.suggestion_status == 1) {
          this.suggestedSuggestions.push(element);
        } else if (element.suggestion_status == 2) {
          this.rejectedSuggestions.push(element);
        } else if (element.suggestion_status == 3) {
          this.acceptedSuggestions.push(element);
        }
      });
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
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  /**
   * show alert to post update on request
   */
  async showUpdateAlert() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const note = new Note();
    note.request_uuid = this.request_uuid;
    note.company_id = this.request.company_id;
    note.contact_uuid = this.request.contact_uuid;

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note: note,
        from: 'post-update'
      }
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
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyRequestFormPage,
      componentProps: {
        request: this.request,
        company: this.request.company,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {

        this.loadDetail(false);
      }
    });
    modal.present();
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

                this.eventService.companyRequestUpdate$.next({
                  company_id: this.request.company_id,
                  request_updated_datetime: response.request_updated_datetime,
                  request_uuid: this.request_uuid
                });

              } else {

                this.toastCtrl.create({
                  message: this.translateLabelService.errorMessage(response.message),
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

            if (!data.feedback || !data.hours) {
              this.alertCtrl.create({
                message: 'Please provide hours & feedback',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
            }
            this.updatingInterval = true;

            const params = {
              request_uuid : this.request_uuid,
              num_hours_followup_interval : data.hours,
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
                  message: this.translateLabelService.errorMessage(response.message),
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

              } else {
                this.toastCtrl.create({
                  message: this.translateLabelService.errorMessage(response.message),
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
   *
   * @param $event
   * @param fulltimer
   */
  async suggestCandidate($event, fulltimer: Fulltimer = new Fulltimer()) {
    $event.preventDefault();
    $event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerFormPage,
      componentProps: {
        request_uuid: this.request_uuid,
        model: fulltimer
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadDetail();
      }
    });
    return await modal.present();
  }
}
