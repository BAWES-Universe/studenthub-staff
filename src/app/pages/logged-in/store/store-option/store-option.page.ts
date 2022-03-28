import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-store-option',
  templateUrl: './store-option.page.html',
  styleUrls: ['./store-option.page.scss'],
})
export class StoreOptionPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  action(action) {
    this.popoverCtrl.dismiss({ action: action });
  }
}
