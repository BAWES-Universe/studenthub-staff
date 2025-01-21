import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {

  public time;

  constructor(public modalCtrl: PopoverController) { }

  ngOnInit() {}

  onChange(event) {
    this.time = format(parseISO(event.detail.value), 'hh:mm a')
    //yyyy-MM-dd 
  }

  save() {

    if(!this.time) {
      this.time = format(parseISO((new Date()).toISOString()), 'hh:mm a')
    }

    this.dismiss({
      time: this.time
    })
  }

  dismiss(data = {}) {
    this.modalCtrl.dismiss(data);
  }
}
