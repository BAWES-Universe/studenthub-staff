import { Component, Input, OnInit } from '@angular/core';
import {AlertController} from "@ionic/angular";
//services
import { AuthService } from 'src/app/providers/auth.service';
import {EventService} from "../../providers/event.service";
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//models
import { Request } from '../../models/request';
import { Invitation } from "../../models/invitation";


@Component({
  selector: 'request-listing',
  templateUrl: './request-listing.component.html',
  styleUrls: ['./request-listing.component.scss'],
})
export class RequestListingComponent implements OnInit {

  @Input() request: Request;
  @Input() invitation: Invitation;
  @Input() showStatus = false;

  public active = false;
  public late = null;

  constructor(
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public alertCtrl: AlertController,
    public eventService: EventService
  ) {
  }

  ngOnInit() {
    if (this.request) {
      const time = this.getHours(this.request.request_updated_datetime);
      const minutes = this.getMinutes(this.request.request_updated_datetime);
      /**
       * Last updated bg color at bottom should change color to red if request is active
       * but last updated is longer than 24 hours ago, otherwise can use green color
       * if completed or active but had update made today.
       */

      this.active = ((minutes - (this.request.num_hours_followup_interval*60)) < 1);

      this.late = (minutes - (this.request.num_hours_followup_interval*60));

      // this.active = time < 24;
    }

    this.eventService.companyRequestUpdate$.subscribe((data: any) => {
      if (data && data.request && data.request.request_uuid == this.request.request_uuid) {
        this.request = Object.assign(this.request, data.request);
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

  toHours(date) {
    if (date) {
      const d = new Date(date.replace(/-/g, '/'));
      return d.getHours();
    }
  }

  /**
   * function created to display color on bottom button
   * @param date
   */
  getHours(date) {
    const d = date ? new Date(date.replace(/-/g, '/') + ' GMT+03:00') : new Date();
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const minutes = Math.round(Math.abs(seconds / 60));
    return Math.round(Math.abs(minutes / 60));
  }

  /**
   * function created to display color on bottom button
   * @param date
   */
  getMinutes(date) {
    const d = date ? new Date(date.replace(/-/g, '/') + ' GMT+03:00') : new Date();
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    return Math.round(Math.abs(seconds / 60));
  }

  kuwaitCurrentTime(date = new Date(), tzString = 'Asia/Kuwait') {
    const time = new Date((typeof date === "string" ? new Date(date) : date).toLocaleString('en-US', { timeZone: tzString }));
    return time;
  }

  getLateTime(minutes) {

    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));

    if (minutes <= 45) {
      return minutes + ' minutes late';
    } else if (minutes <= 90) {
      return 'One hour late';
    } else if (hours <= 22) {
      return `${hours} hours late`;
    } else if (hours <= 36) {
      return 'One day late';
    } else if (days <= 25) {
      return days + ' days late';
    } else if (days <= 45) {
      return 'One month late';
    } else if (days <= 345) {
      return months + ' months late';
    } else if (days <= 545) {
      return 'One year late';
    } else { // (days > 545)
      return years + ' years late';
    }
  }

  async deliverRequest(event, request: Request) {
    event.preventDefault();
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Deliver this request!',
      message: 'Are you sure you want to deliver this request?',
      buttons: [
        {
          text: 'Yes',
          handler:  () => {
            this.eventService.changeRequestStatus$.next({status: 'delivered', request});
          }
        },
        {
          text: 'No',
        }
      ]
    });
    alert.present();
  }

  async finishRequest(event, request: Request) {
    event.preventDefault();
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Finish this request!',
      message: 'Are you sure you want to finish this request work?',
      buttons: [
        {
          text: 'Yes',
          handler:  () => {
            request.request_status = 'finished_by_recruitment';
            this.eventService.changeRequestStatus$.next({status: 'finished_by_recruitment', request});
          }
        },
        {
          text: 'No',
        }
      ]
    });
    alert.present();
  }

  async reworkRequest(event, request: Request) {
    event.preventDefault();
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Rework this request!',
      message: 'Are you sure you want to rework on this request?',
      buttons: [
        {
          text: 'Yes',
          handler:  () => {
            request.request_status = 're_work';
            this.eventService.changeRequestStatus$.next({status: 're_work', request});
          }
        },
        {
          text: 'No',
        }
      ]
    });
    alert.present();
  }

  async createStory(event, request: Request) {
    event.preventDefault();
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Create story for this request!',
      message: 'Are you sure you want to create story for this request?',
      buttons: [
        {
          text: 'Yes',
          handler:  () => {
            this.eventService.createStory$.next({request});
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
