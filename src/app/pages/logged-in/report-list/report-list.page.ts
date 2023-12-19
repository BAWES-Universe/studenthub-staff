import { Component, OnInit } from '@angular/core';
import { NavController, Platform} from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import {AuthService} from '../../../providers/auth.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.page.html',
  styleUrls: ['./report-list.page.scss'],
})
export class ReportListPage implements OnInit {

  public borderLimit = false;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public authService: AuthService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Report List Page');
  }

  openAssignedCompanies() {
    
    this.navCtrl.navigateForward('/view/company-list', {
      state: {
        filters : {
          staff_id: this.authService.staff_id
        }
      }
    });
  } 

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
