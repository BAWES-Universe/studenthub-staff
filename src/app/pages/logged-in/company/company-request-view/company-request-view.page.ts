import { Component, OnInit, ViewChild } from '@angular/core';
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
// models
import { Request } from 'src/app/models/request';
import { Note } from 'src/app/models/note';
// pages
import { CompanyNoteFormPage } from '../company-note-form/company-note-form.page';
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-company-request-view',
  templateUrl: './company-request-view.page.html',
  styleUrls: ['./company-request-view.page.scss'],
})
export class CompanyRequestViewPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public request: Request;
  public requestActivities: Note[] = [];

  public suggestedSuggestions = [];

  public acceptedSuggestions = [];

  public rejectedSuggestions = [];

  public request_uuid;
  public loading = false;
  public loadingInvoice = false;
  public loadingActivities = false;
  public pickingUp = false;

  public borderLimit = false;
  public backState = null;

  public activityExpanded: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public route: ActivatedRoute,
    public authService: AuthService,
    public requestService: CompanyRequestService,
    public requestActivityService: RequestActivityService,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public location: Location,
    public suggestionService: SuggestionService,
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
    // this.loadInvoice();

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
  }

  /**
   * list invoices
   */
  listInvoice() {
    this.loadRequestActivities();
    // this.loadInvoice();
  }

  async showMarkCompleteAlert() {
    // if (this.checkUserPhoneVerified()) {
    //   const alert = await this.alertCtrl.create({
    //     header: 'Mark Complete',
    //     message: 'How satisfied is the customer?',
    //     inputs: [
    //       {
    //         name: 'reason',
    //         type: 'text',
    //       },
    //     ],
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //         cssClass: 'secondary'
    //       }, {
    //         text: 'Okay',
    //         handler: (data) => {
    //           if (data.reason && data.reason.length > 0) {
    //             this.markComplete(data.reason);
    //           } else {
    //             return false;
    //           }
    //         }
    //       }
    //     ]
    //   });
    //   await alert.present();
    // }
  }

  /**
   * mark request as complete
   * @param reason
   */
  // async markComplete(reason) {
  //
  //   const loader = await this.loadingCtrl.create();
  //   loader.present();
  //
  //   const params = {
  //     request_uuid: this.request.request_uuid,
  //     reason
  //   };
  //
  //   this.requestService.markComplete(params).subscribe(jsonResponse => {
  //
  //     // On Success
  //
  //     if (jsonResponse.operation == 'success') {
  //
  //       this.loadRequestActivities();
  //
  //       this.request.request_status = 40;
  //       this.request.request_updated_datetime = jsonResponse.request_updated_datetime;
  //
  //       this.toastCtrl.create({
  //         message: jsonResponse.message,
  //         duration: 3000,
  //         position: 'top'
  //       }).then(toast => toast.present());
  //     }
  //
  //     // On Failure
  //     if (jsonResponse.operation == 'error') {
  //
  //       this.alertCtrl.create({
  //         message: this.translateLabelService.errorMessage(jsonResponse.message),
  //         buttons: ['Ok']
  //       }).then(prompt => prompt.present());
  //     }
  //   }, () => {
  //   }, () => {
  //     loader.dismiss();
  //   });
  // }
  //
  // /**
  //  * mark request as cancel
  //  * @param reason
  //  */
  // async markCancel(reason) {
  //
  //   const loader = await this.loadingCtrl.create();
  //   loader.present();
  //
  //   const params = {
  //     request_uuid: this.request.request_uuid,
  //     reason
  //   };
  //
  //   this.requestService.markCancel(params).subscribe(jsonResponse => {
  //
  //     // On Success
  //
  //     if (jsonResponse.operation == 'success') {
  //
  //       this.loadRequestActivities();
  //
  //       this.request.request_status = 30;
  //       this.request.request_updated_datetime = jsonResponse.request_updated_datetime;
  //
  //       this.toastCtrl.create({
  //         message: jsonResponse.message,
  //         duration: 3000,
  //         position: 'top'
  //       }).then(toast => toast.present());
  //     }
  //
  //     // On Failure
  //     if (jsonResponse.operation == 'error') {
  //
  //       this.alertCtrl.create({
  //         message: this.translateLabelService.errorMessage(jsonResponse.message),
  //         buttons: ['Ok']
  //       }).then(prompt => prompt.present());
  //     }
  //   }, () => {
  //   }, () => {
  //     loader.dismiss();
  //   });

  // }
  //
  /**
   * close this modal
   */
  dismiss() {
    this.location.back();
  }

  /**
   * load request detail
   */
  loadDetail() {
    this.loading = true;

    this.requestService.view(this.request_uuid).subscribe(data => {
      this.request = data;
      this.loadRequestActivities();
      this.loadSuggestions();
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
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0);
  }

  startRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.requestService.start(request).subscribe(async response => {

      if (response.operation == 'success') {
        request.request_status = 'started';
        this.loadRequestActivities();
        this.eventService.reloadStats$.next();
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
                this.eventService.reloadStats$.next();
              } else {
                this.toastCtrl.create({
                  message: response.message,
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
                this.eventService.reloadStats$.next();
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
        }
      ]
    }).then(alert => { alert.present(); });
  }

  /**
   * pickup the request
   * @param event
   * @param request
   */
  pickUpRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.requestService.pickup(request).subscribe(async response => {

      if (response.operation == 'success') {
        this.loadDetail();
        this.loadRequestActivities();
        this.eventService.reloadStats$.next();
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
}
