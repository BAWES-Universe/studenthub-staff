import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-request-filter',
  templateUrl: './request-filter.component.html',
  styleUrls: ['./request-filter.component.scss'],
})
export class RequestFilterComponent implements OnInit {

  @Input() tab = null;

  public borderLimit = false;
  
  public filters = {
    requestStatus: null,
    storyStatus: null,
    position_type: null,
    story_position_type: null,
    startDate: null,
    endDate: null,
  };

  constructor(
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
  }

  filterByStatus($event, requestStatus) {
    this.filters.requestStatus = requestStatus;
  }

  filterByStoryStatus($event, requestStatus) {
    this.filters.storyStatus = requestStatus;
  }

  filterByType($event, positionType, type = 'request') {
    if (type == 'request') {
      this.filters.position_type = positionType;
    } else {
      this.filters.story_position_type = positionType;
    }
  }

  filter() {
    this.modalCtrl.dismiss(this.filters);
  }

  reset() {
    if (this.tab == 'request') {
      this.filters = {
        storyStatus: this.filters.storyStatus,
        requestStatus: null,
        position_type: null,
        story_position_type: this.filters.story_position_type,
        startDate: null,
        endDate: null,
      };
    } else {

      this.filters.startDate = format(parseISO(this.filters.startDate), 'yyyy-MM-dd');

      this.filters.endDate = format(parseISO(this.filters.endDate), 'yyyy-MM-dd');

      this.filters = {
        storyStatus: null,
        requestStatus: this.filters.requestStatus,
        position_type: this.filters.position_type,
        story_position_type: null,
        startDate: this.filters.startDate,
        endDate: this.filters.endDate,
      };
    }
  }

  filterDate($event, type) {
    if (type == 'startDate') {
      this.filters.startDate = format(parseISO($event.original), 'yyyy-MM-dd');
    } else {
      this.filters.endDate = format(parseISO($event.original), 'yyyy-MM-dd');
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
