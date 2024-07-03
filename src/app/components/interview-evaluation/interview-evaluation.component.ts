import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AlertController } from '@ionic/angular';
//model
import { InterviewEvaluation } from 'src/app/models/interview-evaluation';
//services
import { EventService } from 'src/app/providers/event.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'interview-evaluation',
  templateUrl: './interview-evaluation.component.html',
  styleUrls: ['./interview-evaluation.component.scss'],
})
export class InterviewEvaluationComponent implements OnInit {

  @Input() public interviewEvaluation: InterviewEvaluation;

  constructor(
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public alertCtrl: AlertController,
    public eventService: EventService
  ) { }

  ngOnInit() {
    /*if (this.interviewEvaluation.request) {
      const time = this.getHours(this.interviewEvaluation.request.request_updated_datetime);
      const minutes = this.getMinutes(this.interviewEvaluation.request.request_updated_datetime);
      /**
       * Last updated bg color at bottom should change color to red if request is active
       * but last updated is longer than 24 hours ago, otherwise can use green color
       * if completed or active but had update made today.
       *

      this.active = ((minutes - (this.interviewEvaluation.request.num_hours_followup_interval*60)) < 1);

      this.late = (minutes - (this.interviewEvaluation.request.num_hours_followup_interval*60));

      // this.active = time < 24;
    }*/

    this.eventService.companyRequestUpdate$.subscribe((data: any) => {
      if (data && data.request && data.request.request_uuid == this.interviewEvaluation.request.request_uuid) {
        this.interviewEvaluation.request = Object.assign(this.interviewEvaluation.request, data.request);
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


}
