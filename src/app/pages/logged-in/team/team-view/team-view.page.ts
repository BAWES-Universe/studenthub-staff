import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// services
import { StaffService } from 'src/app/providers/logged-in/staff.service';
// models
import { Staff } from 'src/app/models/staff';


@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.page.html',
  styleUrls: ['./team-view.page.scss'],
})
export class TeamViewPage implements OnInit {

  public borderLimit = false;

  public staffID: any;
  public staff: Staff;
  public loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private staffService: StaffService,
  ) { }

  ngOnInit() {
    this.staffID = this.activatedRoute.snapshot.paramMap.get('id');
    const state = window.history.state;
    if (state.model) {
      this.staff = state.model;
    }
    if (!this.staff && this.staffID) {
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this.staffService.detail(this.staffID).subscribe(res => {
      this.loading = false;
      this.staff = res;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
