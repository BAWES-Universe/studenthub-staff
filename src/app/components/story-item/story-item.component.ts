import { Component, Input, OnInit } from '@angular/core';

import {Request, Story} from '../../models/request';
import {AuthService} from "../../providers/auth.service";
import {AlertController} from "@ionic/angular";
import {EventService} from "../../providers/event.service";


@Component({
  selector: 'app-story-item',
  templateUrl: './story-item.component.html',
  styleUrls: ['./story-item.component.scss'],
})
export class StoryItemComponent implements OnInit {

  @Input() request: Request;

  @Input() story: Story;

  public status = {
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
      public authService: AuthService,
      public alertCtrl: AlertController,
      public eventService: EventService
  ) {
  }

  ngOnInit() {
    if(!this.request && this.story.request) {
      this.request = this.story.request;
    }

    this.eventService.storyStatusUpdated$.subscribe((story: any) => {
      if (this.story.story_uuid == story.story.story_uuid) {
        this.story = story.story;
      }
    });
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
  async startStory(event, story) {
    event.preventDefault();
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Start work on story!',
      message: 'Are you sure you want to start work on this story?',
      buttons: [
          {
            text: 'Yes',
            handler:  () => {
              this.eventService.changeStoryStatus$.next({status: this.status.STARTED, story});
            }
          },
          {
            text: 'No',
          }
      ]
    });
    alert.present();
  }

  /**
   * @param event
   * @param story
   */
  async stopStory(event, story) {
    event.preventDefault();
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Stop working on story!',
      message: 'Are you sure you want to stop work on this story?',
      buttons: [
        {
          text: 'Yes',
          handler:  () => {
            this.eventService.changeStoryStatus$.next({status: this.status.STOPPED, story});
          }
        },
        {
          text: 'No',
        }
      ]
    });
    alert.present();
  }

  /**
   * @param event
   * @param story
   */
  async deliverStory(event, story) {
    event.preventDefault();
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Deliver this story!',
      message: 'Are you sure you want to deliver this story?',
      buttons: [
        {
          text: 'Yes',
          handler:  () => {
            this.eventService.changeStoryStatus$.next({status: this.status.DELIVERED, story});
          }
        },
        {
          text: 'No',
        }
      ]
    });
    alert.present();
  }

  /**
   * @param event
   * @param story
   */
  async reworkStory(event, story) {
    event.preventDefault();
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Rework on this story!',
      message: 'Are you sure you want to rework on this story?',
      buttons: [
        {
          text: 'Yes',
          handler:  () => {
            this.eventService.changeStoryStatus$.next({status: this.status.REWORK, story});
          }
        },
        {
          text: 'No',
        }
      ]
    });
    alert.present();
  }
}
