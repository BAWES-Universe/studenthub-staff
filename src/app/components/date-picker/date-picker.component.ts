import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {

  public max;
  public min;
  public date;
  public dateFormatted;

  public presentation = "date";

  constructor(public modalCtrl: PopoverController) { }

  ngOnInit() {}

  onChange(event) {
    this.dateFormatted = format(parseISO(event.detail.value), 'dd/MM/yyyy');
    this.date = format(parseISO(event.detail.value), 'yyyy-MM-dd');
  }

  save() {
    this.dismiss({
      date: this.date,
      dateFormatted: this.dateFormatted
    })
  }

  dismiss(data = {}) {
    this.modalCtrl.dismiss(data);
  }
}
