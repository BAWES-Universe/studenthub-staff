import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-request-filter',
  templateUrl: './request-filter.component.html',
  styleUrls: ['./request-filter.component.scss'],
})
export class RequestFilterComponent implements OnInit {

  public filters;

  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  filterByStatus($event, requestStatus) {
    this.filters.requestStatus = requestStatus;
  }

  filterByType($event, positionType) {
    this.filters.position_type = positionType;
  }

  filter() {
    this.modalCtrl.dismiss(this.filters);
  }

  reset() {
    this.filters = {
      requestStatus: null,
      position_type: null,
      startDate: null,
      endDate: null,
    }
  }
}
