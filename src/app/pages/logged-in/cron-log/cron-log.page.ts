import { Component, OnInit } from '@angular/core';
import { CronLog } from 'src/app/models/cron-log';
import { CronLogService } from 'src/app/providers/logged-in/cron-log.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-cron-log',
  templateUrl: './cron-log.page.html',
  styleUrls: ['./cron-log.page.scss'],
})
export class CronLogPage implements OnInit {

  cronLogs: CronLog[] = [];

  public loading = false; 

  public borderLimit = false;

  constructor(
    private _cronLogService: CronLogService,
    private analyticService: AnalyticsService,
    public translateService: TranslateLabelService
  ) { 
  }

  ngOnInit() {
    this.analyticService.page('Cron Log Page');
    this.loadCronLogs();
  }

  loadCronLogs() {
    this.loading = true;
    this._cronLogService.list().subscribe((res) => {
      this.cronLogs = res;
      this.loading = false;
    });
  }

  doRefresh($event) {
    this.loadCronLogs();
    $event.target.complete();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
