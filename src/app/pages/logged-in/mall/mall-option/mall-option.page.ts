import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-mall-option',
  templateUrl: './mall-option.page.html',
  styleUrls: ['./mall-option.page.scss'],
})
export class MallOptionPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  action(action) {
    this.popoverCtrl.dismiss({ action: action });
  }
}
