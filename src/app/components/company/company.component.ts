import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
// models
import { Company } from 'src/app/models/company';
// services
import { AwsService } from 'src/app/providers/aws.service';
import {Platform} from "@ionic/angular";


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {

  @Output() onUpdate: EventEmitter<any> = new EventEmitter();

  @Input() company: Company;

  constructor(
    public router: Router,
    public aws: AwsService,
    public platform: Platform,
  ) {
  }

  ngOnInit() {

  }

  doNothing(event) {
    event.stopPropagation();
  }

  openCandidatePage() {
    // if(this.company.candidate) {
    //   this.router.navigate(['/candidate-view', this.model.candidate_id]);
    // } else {
    //   this.router.navigate(['/fulltimer', this.model.fulltimer.fulltimer_uuid]);
    // }
  }


  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  loadLogo($event, company) {
    company.company_logo = null;
  }
}
