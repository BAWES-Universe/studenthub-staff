import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, interval } from 'rxjs';
import { AlertController, IonNav, ModalController, NavController } from '@ionic/angular';
// services
import { EventService } from 'src/app/providers/event.service';
import { StoryService } from 'src/app/providers/logged-in/story.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { AuthService } from 'src/app/providers/auth.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
// models
import { Request } from 'src/app/models/request';
import { Invitation } from 'src/app/models/invitation';


export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-story-view',
  templateUrl: './story-view.page.html',
  styleUrls: ['./story-view.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryViewPage implements OnInit, OnDestroy {

  public borderLimit = false;

  public story_uuid: any;
  public story: any;
  public request: Request;
  public loading = false;
  public loadMore = false;

  public suggestedSuggestions = [];

  public acceptedSuggestions = [];

  public rejectedSuggestions = [];

  public invitedCandidates: Invitation[] = [];

  public rejectedCandidates: Invitation[] = [];

  public acceptedInvitations: Invitation[] = [];

  public segment: string = 'invitations';

  private destroyed$ = new Subject();

  private subscription: Subscription;

  public dateNow = new Date();
  // public dDay = new Date('Jan 01 2021 00:00:00');
  public dDay = null;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  constructor(
    private activatedRoute: ActivatedRoute,
    public suggestionService: SuggestionService,
    private storyService: StoryService,
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    private invitationService: InvitationService,
    public translateService: TranslateLabelService,
    public authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    public eventService: EventService,
    public router: Router,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {

    if (!this.story_uuid)
      this.story_uuid = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if (state.model) {
      this.story = state.model;
      this.request = this.story.request;
      this.loadInvitations();
      this.loadSuggestions();

    }

    if (!this.story) {
      this.loadData();
    }

    interval(1000).subscribe(() => {
      if (!this.changeDetector['destroyed']) {
        this.changeDetector.detectChanges();
      }
    });

    this.changeDetector.detectChanges();
    // this.story.story_last_updated_at
    // this.subscription = interval(1000)
    //   .subscribe(x => { this.getTimeDifference(); });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.stopTimer();
  }

  loadData() {
    this.loading = true;

    this.storyService.detail(this.story_uuid, '?expand=request,request.company').subscribe(res => {

      this.loading = false;
      this.story = res;
      this.request = this.story.request;

      this.loadInvitations();
      this.loadSuggestions();
      if (this.story.story_status == 1) {
        this.loadTimer();
      }
      if (this.story.story_status != 1) {
        this.stopTimer();
      }
    });
  }

  /**
 * load invitations for this request
 */
  loadInvitations(loading = true) {
    this.invitationService.list('&request_uuid=' + this.request.request_uuid).subscribe(invitations => {

      this.invitedCandidates = invitations.filter(invitation => invitation.invitation_status == 1);

      this.rejectedCandidates = invitations.filter(invitation => invitation.invitation_status == 2);

      this.acceptedInvitations = invitations.filter(invitation => invitation.invitation_status == 3);
    })
  }

  /**
   * load candidate suggestions for this request
   */
  loadSuggestions() {

    const params = '&request_uuid=' + this.request.request_uuid;

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

        this.story.story_status = status;

        this.eventService.storyStatusUpdated$.next({
          story: this.story
        });

        // Close the page
        this.loadData();
      }

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
   * Loads the create page
   */
  async viewInvitationList(invitationList, invitationStatus) {
    if (invitationList && invitationList.length > 0 && invitationStatus) {
      this.navCtrl.navigateForward('invitation-list', {
        state: {
          story: this.story,
          invitationList: invitationList,
          invitationStatus: invitationStatus
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
          suggestedSuggestions: suggestedSuggestions,
          invitationStatus: invitationStatus
        }
      });
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date)
      return null;

    return new Date(date.replace(/-/g, '/'));
  }

  segmentChanged(event) {
    this.segment = event.target.value;
  }

  private getTimeDifference() {
    this.dDay = new Date(this.dDay);
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
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
      this.navCtrl.navigateForward('candidate-list', {
        state: {
          story: this.story
        }
      });
    } else {
      this.navCtrl.navigateForward('fulltimer-list', {
        state: {
          story: this.story
        }
      });
    }
  }
}
