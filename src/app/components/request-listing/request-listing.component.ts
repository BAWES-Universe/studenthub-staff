import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import {Request} from '../../models/request';

@Component({
  selector: 'request-listing',
  templateUrl: './request-listing.component.html',
  styleUrls: ['./request-listing.component.scss'],
})
export class RequestListingComponent implements OnInit {

  @Input() request: Request;
  @Input() showStatus = true;
  public active = false;
  constructor(public authService: AuthService) {

  }
  ngOnInit() {
    if (this.request) {
      const time = this.getHours(this.request.request_updated_datetime);
      /**
       * Last updated bg color at bottom should change color to red if request is active
       * but last updated is longer than 24 hours ago, otherwise can use green color
       * if completed or active but had update made today.
       */
      this.active = ((this.request.request_status == 'delivered') || ((this.request.staff_id) && (time < 24)));
    }
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
    const d = (date) ? new Date(date.replace(/-/g, '/') + ' UTC') : new Date();
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const minutes = Math.round(Math.abs(seconds / 60));
    return Math.round(Math.abs(minutes / 60));
  }
}
