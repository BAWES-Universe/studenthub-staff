import { Component, OnInit } from '@angular/core';
import {University} from '../../../../models/university';
import {ActivatedRoute} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {UniversityService} from '../../../../providers/logged-in/university.service';


@Component({
  selector: 'app-university-view',
  templateUrl: './university-view.page.html',
  styleUrls: ['./university-view.page.scss'],
})
export class UniversityViewPage implements OnInit {

  public borderLimit = false; 
  
  public university: University;
  public university_id;
  public loading = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public universityService: UniversityService
  ) {
  }

  ngOnInit() {

    if(!this.university_id)
      this.university_id = this.activatedRoute.snapshot.paramMap.get('id');
    
    const state = window.history.state;

    if (state.model) {
      this.university = state.model;
    }

    if (!this.university) {
      this.loadData();
    }
  }

  async loadData() {
    this.loading = true;
    this.universityService.view(this.university_id).subscribe( response => {
      this.loading = false;
      this.university = response;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}

