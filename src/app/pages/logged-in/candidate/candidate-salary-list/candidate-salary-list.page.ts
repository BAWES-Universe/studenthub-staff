import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
// services
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';

@Component({
  selector: 'app-candidate-salary-list',
  templateUrl: './candidate-salary-list.page.html',
  styleUrls: ['./candidate-salary-list.page.scss'],
})
export class CandidateSalaryListPage implements OnInit {

  public borderLimit;
  public loading: boolean = false;
  public candidate;
  public candidate_id;
  public salaryTransfers: any[] = [];

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public candidateService: CandidateService,
  ) {
  }

  ngOnInit() {

    if (!this.candidate_id)
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('candidate_id');

    const state = window.history.state;

    if (state && state.candidate) {
      this.candidate = state.candidate;
    }

    if (!this.candidate) {
      this.loadCandidateDetail();
    }

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });

    this.loadData();
  }

  loadCandidateDetail(loading = true) {
    this.loading = loading;

    this.candidateService.detail(this.candidate_id).subscribe(response => {

      this.loading = false;
      this.candidate = response;
      if(this.candidate){
        this.candidate.pendingField =  this.candidate?.pendingField?.filter(v => v != "experience")
        this.candidate.isProfileCompleted = this.candidate.pendingField.length == 0;
      }

    });
  }

  doRefresh(event) {
    this.loadData();
    event.target.complete();
  }

  /**
   * load candidate notes without pagination
   */
  loadData() {
    this.loading = true;

    this.candidateService.transfers(this.candidate_id).subscribe(response => {

      this.loading = false;

      this.salaryTransfers = response;
    }, () => {
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date)
      return null;

    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }
}
