import { Component, OnInit } from '@angular/core';
import { Platform} from '@ionic/angular';
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
    public authService: AuthService,
  ) { }

  ngOnInit() {

  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
