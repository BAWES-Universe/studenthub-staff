import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import {format, parseISO} from "date-fns";

/**
 * Display alert message to update app on new version availability
 */
@Component({
  selector: 'app-date-popup',
  templateUrl: './date-popup.component.html',
  styleUrls: ['./date-popup.component.scss'],
})
export class DatePopupComponent implements OnInit {

  @Input() title;
  @Input() min;
  @Input() max;
  @Input() value = null;
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor() {
    const today = new Date();
    // var dd = today.getDate();
    const mm = today.getMonth() + 1; // 0 is January, so we must add 1
    const yyyy = today.getFullYear();

    this.min = new Date((yyyy - 90), mm).toISOString();
    this.max = new Date((yyyy + 1), mm).toISOString();
  }

  ngOnInit() { }

  /**
   * close update prompt
   */
  close($event) {
    // console.log($event);
    const dateFromIonDatetime = $event.detail.value;
    const formattedString = format(parseISO(dateFromIonDatetime), 'MMM d, yyyy');
    this.onClose.emit({modified: formattedString,original: $event.detail.value});
  }
}
