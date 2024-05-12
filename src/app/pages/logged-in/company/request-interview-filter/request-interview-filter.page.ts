import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-request-interview-filter',
  templateUrl: './request-interview-filter.page.html',
  styleUrls: ['./request-interview-filter.page.scss'],
})
export class RequestInterviewFilterPage implements OnInit {

  @Input() tab = null;

  public borderLimit = false;
  
  public filters = {
    application_uuid: null,//'9' for unstarted
    request_uuid: null,//'started',
    fulltimer_uuid: null,
    candidate_id: null,
    staff_id: null,
    status: null,
    from: null,
    to: null
  };

  constructor(
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
  }

  filterByStatus($event, status) {
    this.filters.status = status;
  }

  filter() {
    this.modalCtrl.dismiss(this.filters);
  }

  reset() {
    
    this.filters = {
      application_uuid: null,//'9' for unstarted
      request_uuid: null,//'started',
      fulltimer_uuid: null,
      candidate_id: null,
      staff_id: null,
      status: null,
      from: null,
      to: null
    };
  }

  filterDate($event, type) {
    if (type == 'from') {
      this.filters.from = format(parseISO($event.original), 'yyyy-MM-dd');
    } else {
      this.filters.to = format(parseISO($event.original), 'yyyy-MM-dd');
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
