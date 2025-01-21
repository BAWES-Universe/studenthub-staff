import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';


@Component({
  selector: 'app-appeal-filter',
  templateUrl: './appeal-filter.component.html',
  styleUrls: ['./appeal-filter.component.scss'],
})
export class AppealFilterComponent implements OnInit {

  public borderLimit = false;
  
  public filters = {
    from: null,
    to: null,
    status: null
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

  submit() {
    this.modalCtrl.dismiss(this.filters);
  }
  dismiss(){
    this.modalCtrl.dismiss();
  }
  
  reset() {
    
      this.filters = {
        from: null,
        to: null,
        status: null
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
