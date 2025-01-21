import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-work-log',
  templateUrl: './work-log.component.html',
  styleUrls: ['./work-log.component.scss'],
})
export class WorkLogComponent implements OnInit {

  @Input() public hour;

  @Output() onApproveClicked: EventEmitter<any> = new EventEmitter();
  @Output() onRejectClicked: EventEmitter<any> = new EventEmitter();

  constructor(

    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
  }
 
}
