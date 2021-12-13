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
  IonContent
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
import { Request } from 'src/app/models/request';
import { Note } from 'src/app/models/note';
import { StoryService } from 'src/app/providers/logged-in/story.service';
import { Invitation } from 'src/app/models/invitation';
// pages


@Component({
  selector: 'app-invitation-list',
  templateUrl: './invitation-list.page.html',
  styleUrls: ['./invitation-list.page.scss'],
})
export class InvitationListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public request: Request;
  public requestActivities: Note[] = [];


  public invitationList: Invitation[] = [];


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

  public story;
  public story_uuid: any;

  public invitationStatus: string ;

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
    private storyService: StoryService,
    public suggestionService: SuggestionService,
    public invitationService: InvitationService,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public platform: Platform
  ) {
  }

  ngOnInit() {

    // Load the passed model if available
    const state = window.history.state;

    if (state.story && state.invitationList) {
      this.story = state.story;
      this.invitationList = state.invitationList;
    }  else {
      this.dismiss();
    }

   
  }


  /**
   * close this modal
   */
  dismiss() {
    this.location.back();
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


  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0);
  }


}
