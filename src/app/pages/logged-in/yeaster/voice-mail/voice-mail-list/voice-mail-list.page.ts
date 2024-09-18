import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { YeasterService } from 'src/app/providers/logged-in/yeaster.service';

@Component({
  selector: 'app-voice-mail-list',
  templateUrl: './voice-mail-list.page.html',
  styleUrls: ['./voice-mail-list.page.scss'],
})
export class VoiceMailListPage implements OnInit {

  public processing;

  public voiceMails = [];

  public borderLimit = false;

  currentPage
  pageCount
  total

  loading

  constructor(
    public analyticService: AnalyticsService,
    public yeaster: YeasterService) { }

  ngOnInit() {
    this.analyticService.page('Voicemail List Page');

    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.yeaster.list(1, 20).subscribe(res => {
      this.voiceMails = res.data;
      this.currentPage = res.page;
      this.pageCount = res.totalPages;
      this.total = res.total;

      this.loading = false;
    })
  }

  doRefresh(event) {
    this.currentPage = 1;
    this.loadData();
    event.target.complete();
  }

  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.yeaster.list(this.currentPage, 20).subscribe(res => {

      this.loading = false;
 
      this.currentPage = res.page;
      this.pageCount = res.totalPages;
      this.total = res.total;
       
      this.voiceMails = this.voiceMails.concat(res.data);

      event.target.complete();

    }, () => {
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
