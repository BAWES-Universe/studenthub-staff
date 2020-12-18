import { Component, Input, OnInit } from '@angular/core';
import { TransferCandidate } from 'src/app/models/transfer-candidate';

@Component({
  selector: 'transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {

  @Input() transferCandidate: TransferCandidate;

  constructor() { }

  ngOnInit() {}

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }
}
