import { Component } from '@angular/core';
import { Events, NavController, LoadingController } from 'ionic-angular';
// Pages
import { CandidateListPage } from '../candidate/candidate-list/candidate-list';
import { GenerateIdPage } from '../candidate/generate-id/generate-id';
import { ExpiredIdPage } from '../candidate/expired-id/expired-id';
// Services
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
  	private _events: Events,
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
    this._events.publish('navigation:expiredIdCard');
    this._events.publish('navigation:printIdCard',this.statistics.id_need_generated.length);
	},
    error => {},
    () => {loader.dismiss();}
    );
  }

  showExpiredIDs() {
    this.navCtrl.push(ExpiredIdPage);
  }

  showCandidatesRequireNewID() {
    this.navCtrl.push(GenerateIdPage);
  }

  showAssignedCandidates() {
    this.navCtrl.push(CandidateListPage, {
      'segment' : 'assigned'
    });
  }

  showNotAssignedCandidates() {
    this.navCtrl.push(CandidateListPage, {
      'segment': 'not-assigned'
    });
  }
}
