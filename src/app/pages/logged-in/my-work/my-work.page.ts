import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
//model
import { Story } from "../../../models/request";
//services
import { StoryService } from "../../../providers/logged-in/story.service";
import { EventService } from 'src/app/providers/event.service';
import {AuthService} from "../../../providers/auth.service";


@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.page.html',
  styleUrls: ['./my-work.page.scss'],
})
export class MyWorkPage implements OnInit {

  public segment: string = 'current';
  public currentStory: Story[];
  public oldStories: Story[];

  constructor(
    public eventService: EventService,
    public storyService: StoryService,
    public authService: AuthService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    
    this.eventService.companyRequestCancelled$.subscribe((request) => {
      
      this.currentStory = null;
      this.oldStories = [];

      this.loadActiveStories();
      this.loadAllOtherStories();
    });

    this.eventService.companyRequestDelivered$.subscribe((request: any) => {
      
      this.currentStory = null;
      this.oldStories = [];

      this.loadActiveStories();
      this.loadAllOtherStories();
    });

    this.eventService.storyStatusUpdated$.subscribe(() => {

      this.currentStory = null;
      this.oldStories = [];

      this.loadActiveStories();
      this.loadAllOtherStories();
    });
  }

  ionViewWillEnter() {
    this.loadActiveStories();
    this.loadAllOtherStories();
  }

  segmentChanged(event) {
    this.segment = event.target.value;
  }

  loadActiveStories() {
    this.storyService.loadActiveStory().subscribe(res => {
      if(res.body)
        this.currentStory = res.body;
    });
  }

  loadAllOtherStories() {
    this.storyService.listAllOldHistory().subscribe(res => {
      if(res.body)
        this.oldStories = res.body;
    });
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('story-view/' + model.story_uuid, {
      state: {
        model
      }
    });
  }
}
