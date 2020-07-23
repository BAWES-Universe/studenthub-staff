import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'no-items',
  templateUrl: './no-items.component.html',
  styleUrls: ['./no-items.component.scss'],
})
export class NoItemsComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit() {}

}
