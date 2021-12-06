import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// services
import { StaffService } from 'src/app/providers/logged-in/staff.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { EventService } from 'src/app/providers/event.service';
// models

import { StoryService } from 'src/app/providers/logged-in/story.service';
import { Request } from 'src/app/models/request';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { Invitation } from 'src/app/models/invitation';
import { AuthService } from 'src/app/providers/auth.service';
import { InvitationListPage } from '../../invitation-list/invitation-list.page';
import { IonNav, ModalController, NavController } from '@ionic/angular';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { Subject, interval } from 'rxjs';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

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
export class StoryViewPage implements OnInit {

  
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
    public router: Router
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

  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  


  loadData() {
    this.loading = true;

    this.storyService.detail(this.story_uuid, '?expand=request,request.company').subscribe(res => {

      this.loading = false;
      this.story = res;
      this.request = this.story.request;

      this.loadInvitations();
      this.loadSuggestions();
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
 */
  changeStoryStatus(status) {
    this.loading = true;

    this.storyService.changeStoryStatus(status, this.story.story_uuid).subscribe(async response => {

      this.loading = false;

      // On Success
      if (response.operation == 'success') {
        // Close the page
        this.loadData();
      }

      // // On Failure
      // if (response.operation == 'error') {
      //   const prompt = await this.alertCtrl.create({
      //     message: this.authService.errorMessage(response.message),
      //     buttons: ['Okay']
      //   });
      //   prompt.present();
      // }
    }, () => {
      this.loading = false;
    });
  }

  

  /**
   * Loads the create page
   */
  async viewInvitationList(invitationList,invitationStatus) {
    if(invitationList && invitationList.length > 0 && invitationStatus){
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
  async viewSuggestionList(suggestedSuggestions,invitationStatus) {
    if(suggestedSuggestions && suggestedSuggestions.length > 0 && invitationStatus){
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

}
