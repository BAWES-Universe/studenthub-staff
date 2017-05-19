import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
//import { Platform } from 'ionic-angular';

/*
  Select search component, renders a select form input with search filter functionality.
*/
@Component({
  selector: 'select-search',
  templateUrl: 'select-search.html',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSearchComponent),
      multi: true
    }
  ]
})
export class SelectSearchComponent implements ControlValueAccessor {
  // Default value the form element should have 
  _value: string;

  // Icon to use, by default its a regular image icon
  @Input() options: string = "Photo";

  // Used for link generation after upload
  public bucketUrl: string;

  // the method set in registerOnChange, it is just 
  // a placeholder for a method that takes one parameter, 
  // we use it to emit changes back to the form
  private _propagateChange = (_: any) => {};

  constructor() {
  }


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
    this._value = val;
    // Notify of changes
    this._propagateChange(this._value);
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
    if (obj) {
      this.value = obj;
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
  registerOnTouched() {}

    
}
