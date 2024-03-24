import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, interval } from 'rxjs';
import {
  AlertController,
  IonNav, LoadingController,
  ModalController,
  NavController,
  PopoverController,
  ToastController
} from '@ionic/angular';
// services
import { EventService } from 'src/app/providers/event.service';
import { StoryService } from 'src/app/providers/logged-in/story.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { AuthService } from 'src/app/providers/auth.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
// models
import {Request, Story} from 'src/app/models/request';
import { Invitation } from 'src/app/models/invitation';
import {StoryViewOptionPage} from './story-view-option.page';
import {StoryCloseConfirmationComponent} from './story-close-confirmation.component';
import {NoteService} from '../../../../providers/logged-in/note.service';
import {Note} from '../../../../models/note';
import { StoryDeliveredComponent } from './story-delivered.component';
import { StaffPage } from '../../pickers/staff/staff.page';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';


export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-story-view',
  templateUrl: './story-view.page.html',
  styleUrls: ['./story-view.page.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryViewPage implements OnInit, OnDestroy {

  public borderLimit = false;
  public sortedNotes: any = [];
  public story_uuid: any;
  public story: Story;
  public request: Request;
  public notes: Note[];
  public loading = false;
  public loadMore = false;

  public allSuggestions = [];
  public suggestedSuggestions = [];
  public acceptedSuggestions = [];
  public rejectedSuggestions = [];
  public allInvitedCandidates: Invitation[] = [];
  public invitedCandidates: Invitation[] = [];
  public rejectedCandidates: Invitation[] = [];
  public acceptedInvitations: Invitation[] = [];
  public segment = 'detail';
  private destroyed$ = new Subject();
  private subscription: Subscription;
  public alertConfirmReload;

  public dateNow = new Date();
  // public dDay = new Date('Jan 01 2021 00:00:00');
  public dDay = null;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  public internvalSubscribe;
  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  public alertRequestUpdated: boolean = false;

  public IPageCount = 0;
  public IcurrentPage = 0;
  public Itotal = 0;
  public SPageCount = 0;
  public ScurrentPage = 0;
  public Stotal = 0;

  public storyStatus = {
    UNSTARTED : 0,
    STARTED: 1,
    FINISHED: 2,
    DELIVERED: 3,
    REJECTED: 4,
    ACCEPTED: 5,
    CANCELLED: 6,
    REWORK: 7,
    STOPPED: 8,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    public suggestionService: SuggestionService,
    public requestService: CompanyRequestService,
    private storyService: StoryService,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private invitationService: InvitationService,
    public translateService: TranslateLabelService,
    public authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    public eventService: EventService,
    public router: Router,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public noteService: NoteService,
    public loadingCtrl: LoadingController,
  ) {
  }

  ngOnInit() {
    this.internvalSubscribe = setInterval(_ => {
      //this.isStoryUpdated();
      this.isRequestUpdated();
    }, 6 * 1000); // every 6 seconds
  }

  /**
   * check if request updated, if so reload details
   */
  isRequestUpdated() {

    if (!this.story || this.alertRequestUpdated) {
      return null;
    }

    this.requestService.isRequestUpdated(this.story.request_uuid).subscribe(data => {
      if (data.request_updated_datetime != this.request.request_updated_datetime) {
        //this.loadDetail(false);//refresh without showing loader
        this.alertRequestUpdated = true;
      }
    });
  }

  ionViewWillEnter() {

    if (!this.story_uuid) {
      this.story_uuid = this.activatedRoute.snapshot.paramMap.get('id');
    }

    const state = window.history.state;

    if (!this.story) {
      this.loadData();
    }

    interval(1000).subscribe(() => {
      if (!this.changeDetector) {
        this.changeDetector.detectChanges();
      }
    });

    this.changeDetector.detectChanges();

    this.eventService.companyRequestCancelled$.subscribe((request: any) => {
      if (this.story && request.request_uuid == this.story.request_uuid) {
        this.loadData();
      }
    });

    this.eventService.companyRequestDelivered$.subscribe((request: any) => {
      if (this.story && request.request_uuid == this.story.request_uuid) {
        this.loadData();
      }
    });

    // this.story.story_last_updated_at
    // this.subscription = interval(1000)
    //   .subscribe(x => { this.getTimeDifference(); });
  }

  ngOnDestroy() {
    this.destroyed$.next({});
    this.destroyed$.complete();
    this.stopTimer();
    if (this.internvalSubscribe) {
      clearInterval(this.internvalSubscribe);
    }
  }

  /**
   * load story details
   */
  loadData() {
    this.loading = true;

    this.storyService.detail(this.story_uuid, '?expand=staff,storyActivities,storyActivities.staff,request,request.contact,request.staffs,request.company').subscribe(res => {

      //hide update alert

      this.alertRequestUpdated = false;

      this.loading = false;
      this.story = res;
      this.request = this.story.request;

      this.loadStoryInvitations();
      this.loadSuggestions();
      this.loadNotes();

      if (this.story.story_status == 1 && this.story.staff_id == this.authService.staff_id &&
        ['cancelled', 'delivered'].indexOf(this.story.request.request_status) == -1)
      {
        this.authService.story = this.story;
        this.authService.saveInStorage();
      }

      /*if (this.story.story_status == 1) {
        this.loadTimer();
      }

      if (this.story.story_status != 1) {
        this.stopTimer();
      }*/
    });
  }

  /**
   * load invitations
   * @param loading
   */
  loadStoryInvitations(loading = true) {
    this.invitationService.listWithPagination('?expand=candidate,note,story&request_uuid=' + this.request.request_uuid).subscribe(invitations => {
      this.allInvitedCandidates = invitations.body;

      this.IPageCount = parseInt(invitations.headers.get('X-Pagination-Page-Count'));
      this.IcurrentPage = parseInt(invitations.headers.get('X-Pagination-Current-Page'));
      this.Itotal = parseInt(invitations.headers.get('X-Pagination-Total-Count'));
    });
  }

  /**
   * load candidate suggestions for this request
   */
  loadSuggestions() {

    const params = '&story_uuid=' + this.story_uuid;

    this.suggestionService.list(1, params).subscribe(data => {
      this.allSuggestions = data.body;
      this.SPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.ScurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.Stotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
    });
  }

  /**
   * save suggestion
   * @param status
   */
  changeStoryStatus(status) {

    this.loading = true;

    this.storyService.changeStoryStatus(status, this.story.story_uuid).subscribe(async response => {

      this.loading = false;

      // On Success
      if (response.operation == 'success') {

        // incase of rework set it to 1
        this.story.story_status = (status == 7) ? 1 : status;

        this.eventService.storyStatusUpdated$.next({
          story: this.story
        });

        // story work started
        if (status == 1) {
          this.story.staff_id = this.authService.staff_id;
          this.authService.story = this.story;
          this.authService.saveInStorage();
        }

        // story work stopped
        if (status == 0 || status == 3) {
            this.authService.story = null;
            this.authService.saveInStorage();
        }

        if (status == 3) {
          this.showStoryDelivered(
            response.newStoryActivity,
            response.totalDelivered,
            response.total,
            response.nextStory
          );
        }

        // Close the page
        this.loadData();
      }

      if (response.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();

        /// in case if its alrady working
        if (response.data) {
          this.navCtrl.navigateForward(['story-view', response.data.story_uuid]);
        }
      }
    }, () => {
      this.loading = false;
    });
  }

  /**
   * Loads the create page
   */
  async viewInvitationList(invitationList, invitationStatus) {
    if (invitationList && invitationList.length > 0 && invitationStatus) {
      this.navCtrl.navigateForward('invitation-list', {
        state: {
          story: this.story,
          invitationList,
          invitationStatus
        }
      });
    }
  }

  /**
   * Loads the create page
   */
  async viewSuggestionList(suggestedSuggestions, invitationStatus) {
    if (suggestedSuggestions && suggestedSuggestions.length > 0 && invitationStatus) {
      this.navCtrl.navigateForward('suggestion-list', {
        state: {
          story: this.story,
          suggestedSuggestions,
          invitationStatus
        }
      });
    }
  }

  logScrolling(e) {
    // this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date) {
      return null;
    }

    return new Date(date.replace(/-/g, '/'));
  }

  segmentChanged(event) {
    this.segment = event.target.value;
  }

  private getTimeDifference() {
    this.dDay = new Date(this.dDay);
    this.timeDifference = new Date().getTime() - this.dDay.getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  loadTimer() {

    this.dDay = this.toDate(this.story.story_last_updated_at);

    this.subscription = interval(1000)
      .subscribe(x => { this.getTimeDifference(); });
  }

  stopTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * show candidate to invite
   */
  showCandidates() {

    if ([2, '2'].indexOf(this.request.request_position_type) > -1) {
      this.navCtrl.navigateForward('view/candidate-search', {
        state: {
          story: this.story
        }
      });
    } else {
      this.navCtrl.navigateForward('fulltimer-search', {
        state: {
          story: this.story
        }
      });
    }
  }

  /**
   * view request detail page
   * @param e
   */
  async openPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: StoryViewOptionPage,
      event: e
    });
    popover.present();
    popover.onDidDismiss().then(click => {
      if (click && click.data && click.data.click) {
        this.requestView();
      }
    });
  }

  requestView() {
    this.navCtrl.navigateForward('request-view/' +  this.request.request_uuid);
  }

  /**
   * open story delivered popup
   * @returns
   */
  async showStoryDelivered(storyActivity, totalDelivered, total, nextStory = null) {

    const modal = await this.modalCtrl.create({
      component: StoryDeliveredComponent,
      componentProps: {
        totalDelivered,
        total,
        storyActivity,
        // nextStory: nextStory
      },
      cssClass: 'modal-request-filter modal-delivered-story',
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data){
      return null;
    }

    if (data.action == 'request')
    {
      this.navCtrl.navigateForward(['request-view', this.story.request_uuid]);
    }
    else if (data.action == 'next')
    {
      this.navCtrl.navigateForward(['story-view', nextStory.story_uuid]);
    }
    else if (data.action == 'back')
    {
      this.navCtrl.back();
    }
  }

  /**
   * open popup to confirm stop working and close
   * @returns
   */
  async closeStoryConfirmation() {

    const modal = await this.modalCtrl.create({
      component: StoryCloseConfirmationComponent,
      cssClass: 'modal-request-filter close-story',
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data && data.click) {
      this.changeStoryStatus(8);
    }
  }

  updateValue(event) {

    this.alertCtrl.create({
      header: 'Post an Update',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'update'
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
              const note = new Note();
              note.staff_id = this.authService.staff_id;
              note.company_id = this.story.request.company.company_id;
              note.request_uuid = this.story.request.request_uuid;
              note.story_uuid = this.story.story_uuid;
              note.note_type = 'Internal Note';
              note.note_text = data.feedback;
              this.noteService.create(note).subscribe(async response => {
                if (response.operation == 'success') {
                  this.loadNotes();
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

  /**
   * load notes
   */
  loadNotes() {
    const searchParams = this.urlParams();

    this.noteService.list(searchParams, 1).subscribe(async response => {

      this.notes = response.body;
      this.sortNotes();
    });
  }

  urlParams() {
    const url = 'story_uuid=' + this.story.story_uuid;
    return url;
  }

  /**
   * check if request updated, confirm reload
   */
  isStoryUpdated() {

    if (!this.story || this.alertConfirmReload || this.alertRequestUpdated) {
      return null;
    }

    this.storyService.isUpdated(this.story_uuid).subscribe(data => {
      if (data.story_last_updated_at != this.story.story_last_updated_at) {
        //this.confirmReload(data.story_last_updated_at);
        this.alertRequestUpdated = true;
      }
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  closeAlert() {
    this.alertRequestUpdated = false;
  }

  /**
   * confirm data reload when request get updated
   */
  async confirmReload(request_updated_datetime) {

    // this.loadDetail(false);//refresh without showing loader

    this.alertConfirmReload = await this.alertCtrl.create({
      header: 'Story updated',
      subHeader: 'Refresh to view latest update',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // to ignore current update
            this.story.story_last_updated_at = request_updated_datetime;
            this.alertConfirmReload = null;
          }
        }, {
          text: 'Refresh',
          handler: (data) => {
            this.loadData();
            this.alertConfirmReload = null;
          }
        }
      ]
    });
    this.alertConfirmReload.present();
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

    if (data && data.staff_id) {

      this.storyService.assign(this.story_uuid, data.staff_id).subscribe(async res => {

        if (res.operation == 'success') {
          this.story.staff = res.staff;
        }
        else
        {
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

  sortNotes(){
    this.sortedNotes = [];
    let activities = [];
    let notes = [];
    if (this.story.storyActivities && this.story.storyActivities.length > 0) {
      activities = this.story.storyActivities.map(activity => Object.assign({
        time: activity.activity_created_at,
        type: 'activity',
        data: activity
      }));
    }
    if (this.notes && this.notes.length > 0) {
      notes = this.notes.map(activity => Object.assign({
        time: activity.note_created_datetime,
        type: 'note',
        data: activity
      }));
      this.sortedNotes.push(...notes);
    }
    this.sortedNotes.push(...activities);
    this.sortedNotes = this.sortedNotes.sort((a: any, b: any) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }

  async doInfinite(event) {

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();

    this.IcurrentPage++;

    const urlParams = '?expand=candidate,note,story&request_uuid=' + this.story.request_uuid + '&page=' + this.IcurrentPage;
    
    this.invitationService.listWithPagination(urlParams).subscribe(invitations => {

        this.IPageCount = parseInt(invitations.headers.get('X-Pagination-Page-Count'));
        this.IcurrentPage = parseInt(invitations.headers.get('X-Pagination-Current-Page'));
        this.Itotal = parseInt(invitations.headers.get('X-Pagination-Total-Count'));

        this.allInvitedCandidates = this.allInvitedCandidates.concat(invitations.body);

      },
      error => { },
      () => {
        this.loading = false;
        loading.dismiss();
        event.target.complete();
      }
    );
  }


  async doInfiniteSuggestion(event) {

    this.ScurrentPage++;

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();

    const params = '&request_uuid=' + this.story.request_uuid;

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

}
