import { Component, forwardRef, Input, OnChanges, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as dateFns from 'date-fns';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-date-dropdown',
  templateUrl: './date-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateDropdownComponent),
      multi: true
    }
  ],
  styleUrls: ['./date-dropdown.component.scss'],
})
export class DateDropdownComponent implements ControlValueAccessor, OnInit, OnChanges {

  @Input()
  set min(min) {
    this.minDate = new Date(min); // Minimal selectable date
    this.minYear = new Date(min).getFullYear();
    this.minDateString = this.dateString(this.minDate);
  }

  @Input()
  set max(max) {
    this.maxDate = new Date(max);  // Maximal selectable date
    this.maxYear = new Date(max).getFullYear();
    this.maxDateString = this.dateString(this.maxDate);
  }

  selectedDate = null;
  selectedMonth = null;
  selectedYear = null;

  constructor( 
    public platform: Platform
  ) { }

  /**
     * Getter for Value
     */
  get value() {
    return this._value;
  }

  /**
     * Setter for Value
     */
  set value(val) {
    const date = new Date(val);

    const month = date.getMonth() + 1;

    this._value = date.getFullYear() + '/' + month + '/' + date.getDate();

    // Notify of changes

    setTimeout(_ => {
      this._propagateChange(this._value);
    }, 1);
  }

  public minDateString;
  public maxDateString;

  // Default value the form element should have
  public _value: any;

  public minYear;
  public maxYear;
  minDate; // Minimal selectable date
  maxDate;  // Maximal selectable date

  public days;
  public months;
  public years;

  @Input() placeholder: string;

  @Input() pickerFormat;
  @Input() displayFormat;

  @Input() position;

  // the method set in registerOnChange, it is just
  // a placeholder for a method that takes one parameter,
  // we use it to emit changes back to the form
  public _propagateChange = (_: any) => { };
  public onTouchedCallback = (_: any) => { };

  ngOnInit() { }

  ngOnChanges(changes) {
    if ('min' in changes || 'max' in changes) {
      this.init();
      this.initMonths();
      this.initYears();
    }
  }

  dateString(d) {
    function pad(n) { return n < 10 ? '0' + n : n; }

    return d.getFullYear() + '-'
      + pad(d.getMonth() + 1) + '-'
      + pad(d.getDate());

    /*+'T'
    + pad(d.getHours())+':'
    + pad(d.getMinutes())+':'
    + pad(d.getSeconds())+'Z'*/
  }

  isNil(value) {
    return (typeof value === 'undefined') || (value === null);
  }

  isDateSelectable(date) {
    // if (this.isNil(this.options)) {
    //    return true;
    // }

    const minDateSet = !this.isNil(this.minDate);
    const maxDateSet = !this.isNil(this.maxDate);
    const timestamp = date.valueOf();

    if (minDateSet && (timestamp < this.minDate.valueOf())) {
      return false;
    }

    if (maxDateSet && (timestamp > this.maxDate.valueOf())) {
      return false;
    }

    return true;
  }

  /**
   * init days
   */
  init() {

    const actualDate = new Date(this.value).getTime() || new Date();

    const start = dateFns.startOfMonth(actualDate);
    const end = dateFns.endOfMonth(actualDate);

    this.days = dateFns.eachDayOfInterval({ start, end }).map(date => {

      const selectedDate = new Date(this._value).getTime();

      return {
        // date: date,
        day: dateFns.getDate(date),
        isSelected: this._value && dateFns.isSameDay(date, selectedDate) && dateFns.isSameMonth(date, selectedDate) && dateFns.isSameYear(date, selectedDate),
        isSelectable: true// this.value? this.isDateSelectable(date): true
        /*month: dateFns.getMonth(date),
        year: dateFns.getYear(date),
        inThisMonth: true,
        isToday: dateFns.isToday(date),*/
      };
    });
  }

  initMonths() {
    const selectedDate = new Date(this._value);

    // if same year

    if (this.minDate && this.maxDate && this.minDate.getFullYear() == this.maxDate.getFullYear()) {

      const months = [];

      for (let i = this.minDate.getMonth(); i <= this.maxDate.getMonth(); i++) {
        months.push({
          month: i + 1,
          isSelectable: this.isDateSelectable(selectedDate.getFullYear() + '/' + (i + 1) + '/01'),
          isSelected: (i + 1) === dateFns.getMonth(selectedDate.getTime()) + 1
        });
      }

      return this.months = months;
    }

    this.months = Array.from(
      new Array(12),
      (x, i) => {
        return i + 1;
      }
    ).map(month => {

      return {
        month: month,
        isSelectable: this.isDateSelectable(selectedDate.getFullYear() + '/' + month + '/01'),
        isSelected: month === dateFns.getMonth(new Date(this.value).getTime()) + 1
      };
    });
  }

  initYears() {

    const range = this.maxYear - this.minYear + 1;

    // if max and min year is same

    if (range == 0) {
      return [{
        year: this.maxYear,
        isSelected: true
      }];
    }

    this.years = Array.from(
      new Array(range),
      (x, i) => {
        return i + this.minYear;
      }
    ).map((year) => {
      return {
        year: year,
        isSelected: year === dateFns.getYear(new Date(this.value).getTime())
      };
    });
  }

  /**
   * set value when user select date in capacitor/mobile device
   * @param event
   */
  onDateChange(event) {
    this.value = event.target.value;
  }

  /**
   * on month change
   * @param event
   */
  onMonthChange(event) {

    if (!event.target.value) {
      return null;
    }

    this.selectedMonth = event.target.value;

    const picDate = this.pickerFormat.indexOf('D') !== -1;

    // check if date (in case date is enable) and year is selected

    //for date month year format 

    if (picDate && this.selectedDate && this.selectedYear) {
      const date = this._value ? new Date(this._value) : new Date();
      this.value = this.selectedYear + '/' + event.target.value + '/' + date.getDate();
      this.init(); // reset days

    // for month year formats

    } else if (!picDate && this.selectedYear) {
      this.value = this.selectedYear + '/' + event.target.value + '/1';
      this.init(); // reset days
    }
  }

  /**
   * on day change
   * @param event
   */
  onDayChange(event) {

    if (!event.target.value) {
      return null;
    }

    this.selectedDate = event.target.value;

    if (this.selectedMonth && this.selectedYear) {
      this.value = this.selectedYear + '/' + this.selectedMonth + '/' + event.target.value;
    }
  }

  /**
   * on year change
   * @param event
   */
  onYearChange(event) {
    if (!event.target.value) {
      return null;
    }

    const picDate = this.pickerFormat.indexOf('D') !== -1;

    this.selectedYear = event.target.value;
    
    const date = this._value ? new Date(this._value) : new Date();

    //for DMY formats 

    if (this.selectedDate && this.selectedMonth) {
      this.value = event.target.value + '/' + this.selectedMonth + '/' + this.selectedDate;

    //for month and year format 

    } else if (!picDate && this.selectedMonth) {
      this.value = event.target.value + '/' + this.selectedMonth + '/' + date.getDate();
    }
  }

  /**
   * Propogate change on change, notify outside world of changes
   * @param {any} fn
   */
  registerOnChange(fn) {
    this._propagateChange = fn;
  }

  /**
   * Called on touch/ element blur
   */
  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }

  /**
   * ControlValueAccessor interface methods
   * - They allow this component to be used as a form element (with validation and ngModel)
   */

  /**
   * Called on form Init / Update
   * @param {*} obj
   */
  writeValue(obj: any) {

    const today = new Date();

    if (obj) {
      this._value = obj;
    }

    /*else if (this.isDateSelectable(today)) {
      const month = today.getMonth() + 1;

      if (this.pickerFormat && this.pickerFormat.indexOf('D') !== -1) {
        this.value = today.getFullYear() + '/' + month + '/' + today.getDate();
      } else {
        this.value = today.getFullYear() + '/' + month + '/1';
      }
    }
    else {
      const month = this.maxDate.getMonth() + 1;

      if (this.pickerFormat && this.pickerFormat.indexOf('D') !== -1) {
        this.value = this.maxDate.getFullYear() + '/' + month + '/' + this.maxDate.getDate();
      } else {
        this.value = this.maxDate.getFullYear() + '/' + month + '/1';
      }
    }*/

    if (this._value) {
      const date = this._value ? new Date(this._value) : null;

      if (date) {
        // initialise values
        this.selectedMonth = date.getMonth() + 1;
        this.selectedYear = date.getFullYear();
        this.selectedDate = date.getDate();
      }

      this.init();
      this.initMonths();
      this.initYears();
    }
  }
}
