import { Component, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Display alert message to update app on new version availability 
 */
@Component({
  selector: 'update-alert',
  templateUrl: './update-alert.component.html',
  styleUrls: ['./update-alert.component.scss'],
})
export class UpdateAlertComponent implements OnInit {

  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() { }

  /**
   * Reload app 
   */
  refresh() {
    this.onRefresh.emit();
  }

  /**
   * close update prompt 
   */
  close() {
    this.onClose.emit();
  }
}