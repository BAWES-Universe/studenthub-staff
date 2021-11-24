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
  @Input() page = null;
  public totalCandidates = 0;
  constructor(
    public router: Router,
    public aws: AwsService,
    public platform: Platform,
  ) {
    if (this.company) {
      this.totalCandidates = this.company.total_candidate;
    }
  }

  ngOnInit() {
    this.countCandidate();
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
    if (!date) 
      return null;
      
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  loadLogo($event, company) {
    company.company_logo = null;
  }

  countCandidate() {
    if (this.company && this.company.stores && this.company.stores.length > 0) {
      this.company.stores.map(store => {
        this.totalCandidates += store.store_total_candidates;
      });
    }

    if (this.company && this.company.subCompanies && this.company.subCompanies.length > 0) {
      this.company.subCompanies.map(subCompanies => {
        if (subCompanies && subCompanies.stores.length > 0) {
            subCompanies.stores.map(store => {
              this.totalCandidates += store.store_total_candidates;
            });
          }
      });
    }
  }
}
