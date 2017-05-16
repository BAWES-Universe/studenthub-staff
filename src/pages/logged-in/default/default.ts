import { Component } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';

import { StatisticService } from '../../../providers/logged-in/statistic.service';

@Component({
  selector: 'page-default',
  templateUrl: 'default.html'
})
export class DefaultPage {

  public statistics: any;

  constructor(
  	public navCtrl: NavController,
  	public statisticService: StatisticService,
  	private _loadingCtrl: LoadingController,
  ) {

  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    // Load list of country
    let loader = this._loadingCtrl.create();
    loader.present();
    
    this.statisticService.get().subscribe(response => {
		this.statistics = response;
	},
    error => {},
    () => {loader.dismiss();}
    );
  }
}
