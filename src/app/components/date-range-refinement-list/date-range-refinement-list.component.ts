import { Component, Input, Inject, forwardRef, EventEmitter, Output, OnInit } from '@angular/core';
import { connectRange } from 'instantsearch.js/es/connectors';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { parseNumberInput, noop } from 'angular-instantsearch/esm2015/utils';
import {CalendarModal, CalendarModalOptions, CalendarResult} from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import {Options} from "ng5-slider";

@Component({
  selector: 'date-range-refinement-list',
  templateUrl: './date-range-refinement-list.component.html',
  styleUrls: ['./date-range-refinement-list.component.scss'],
})
export class DateRangeRefinementListComponent extends BaseWidget {

  @Input() title;
  @Input() subTitle;

  @Input() pips;
  @Input() tooltips;
  @Input() attribute;
  @Input() min;
  @Input() max;
  @Input() precision;
  @Input() currencies;

  @Output() change: EventEmitter<any> = new EventEmitter();

  state;
  slider;
  updateState;
  handleChange;
  formatTooltip;

  open = false;
  dirty = false;

  value;

  average;
  lowerDate;
  upperDate;

  options: Options = {
    floor: 0,
    ceil: 1,
  }

  constructor(
      @Inject(forwardRef(() => NgAisInstantSearch))
      public instantSearchParent,
      public modalCtrl: ModalController
  ) {
      super('RangeRefinementComponent');

      // render options
      this.pips = true;
      this.tooltips = true;
      this.precision = 2;

      this.state = {
          range: {min: 0, max: 1},
          refine: noop,
          start: [0, 1],
      };

      this.updateState = (state, isFirstRendering) => {
          // update component inner state
          this.state = state;

          // update the slider state
          const {range: {min, max}, start, } = state;

          setTimeout(_ => {

              this.min = (min === max) ? 0 : Math.ceil(min);
              this.max = Math.ceil(max);

              const disabled = this.min === this.max;

              let lower;
              let upper;

              if (this.state.start[0] == '-Infinity') {
                  lower = this.min;
              } else {
                  lower = this.state.start[0];
              }

              if (this.state.start[1] == 'Infinity') {
                   upper = this.max;
              } else {
                   upper = this.state.start[1];
              }

              if (this.state.start[0] == '-Infinity' && this.state.start[1] == 'Infinity') {
                  this.dirty = false;
              } else {
                  this.dirty = true;
              }

              this.value = disabled ? { lower: lower, upper: upper + 0.0001 } : { lower: lower, upper: upper };

              // Due to change detection rules in Angular, we need to re-create the options object to apply the change
              const newOptions: Options = Object.assign({}, this.options);
              newOptions.ceil = Math.max(this.max, this.value.upper);
              newOptions.floor = Math.min(this.min, this.value.lower);

              //newOptions.animate = false;
              //newOptions.rightToLeft = this.translateLabel.currentLang == 'ar';
              this.options = newOptions;

              this.setLabel(); // update label
          });
      };

      this.handleChange = () => {

          //let range = [e.detail.value.lower, e.detail.value.upper];

          let range = [this.value.lower, this.value.upper];
          this.state.refine(range);
          //this.change.emit();
      };

      this.formatTooltip = (value) => {
          return value.toFixed(parseNumberInput(this.precision));
      };
  }

  /**
   * on range change by user
   * @param ev
   */
  onChange(ev) {
      this.setLabel();
      this.handleChange();
  }

  /**
   * @return {?}
   */
  ngOnInit() {
      this.createWidget(connectRange, {
          attributeName: this.attribute,
          attribute: this.attribute,
          max: parseNumberInput(this.max),
          min: parseNumberInput(this.min),
          precision: parseNumberInput(this.precision),
      });
      super.ngOnInit();
  }

  /**
   * @return {?}
   */
  get step() {
      // compute step from the precision value
      /** @type {?} */
      const precision = parseNumberInput(this.precision) || 2;
      return 1 / Math.pow(10, precision);
  }

  /**
   * Set value range label
   */
  setLabel() {
    this.average = (Math.floor(this.min) + Math.floor(this.max)) / 2;
  }

  /**
   * Clear range selection
   */
  handleClearAllClick(event) {

      //to fix: https://www.pivotaltracker.com/story/show/170494756

      if (
          this.instantSearchParent.searchParameters && this.instantSearchParent.searchParameters.disjunctiveFacetsRefinements
          && this.instantSearchParent.searchParameters.disjunctiveFacetsRefinements[this.attribute]
      ) {
          this.instantSearchParent.searchParameters.disjunctiveFacetsRefinements[this.attribute] = [];
      }

      //clear value

      this.value = { lower: this.min, upper: this.max };

      this.dirty = false;

      //update list

      this.handleChange();
      event.preventDefault();
      event.stopPropagation();
  }

  /**
   * Toggle filter open/close
   */
  toggleOpen() {
      this.open = !this.open;
  }

  /**
   * open calender to select range
   */
  async openCalendarPopup(string) {

    const options: CalendarModalOptions = {
      canBackwardsSelected: true,
      pickMode: 'single',
      title: '',
      //defaultScrollTo: new Date(this.value.upper),
      defaultDateRange: {
        from: new Date(this.value.lower),
        to:  new Date(this.value.upper)
      }
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      cssClass: 'modal-calender',
      componentProps: { options }
    });

    myCalendar.present();

    const eventCloseData: any = await myCalendar.onDidDismiss();
    const date = eventCloseData.data;

    if (date) {

      if (string =='l') {
        this.lowerDate = date.string;
        this.value.lower = date.unix;
      } else if (string =='h') {
        this.upperDate = date.string;
        this.value.upper = date.unix;
      }
      //this.value.upper = date.unix + (60*60*24);

      // this.date = date.from.string + ' - ' + date.to.string;

      this.handleChange();
    }
  }
}
