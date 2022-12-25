import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-story-filter',
  templateUrl: './story-filter.component.html',
  styleUrls: ['./story-filter.component.scss'],
})
export class StoryFilterComponent implements OnInit {

  public filters = {
    status: null,
    startDate: null,
    endDate: null,
  };

  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  filterByStatus($event, status) {
    this.filters.status = status;
  }

  filter() {

    this.filters.startDate = format(parseISO(this.filters.startDate), 'yyyy-MM-dd');
    this.filters.endDate = format(parseISO(this.filters.endDate), 'yyyy-MM-dd');

    this.modalCtrl.dismiss(this.filters);
  }

  reset() {
    this.filters = {
      status: null,
      startDate: null,
      endDate: null,
    }
  }
}
