import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//models
import { Company } from 'src/app/models/company';
//servies
import { CompanyService } from 'src/app/providers/logged-in/company.service';


@Component({
  selector: 'app-company-malls',
  templateUrl: './company-malls.page.html',
  styleUrls: ['./company-malls.page.scss'],
})
export class CompanyMallsPage implements OnInit {

  public company_id;

  public company: Company;
  public loading= false;

  public borderLimit: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public companyService: CompanyService
  ) { }

  ngOnInit() {

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    const state = window.history.state;

    if(state.company) {
      this.company = state.company;
    } else {
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this.companyService.view(this.company_id).subscribe(data => {
      this.loading = false;
      this.company = data;
    });
  }

  /**
   * open brand edit page
   * @param mall
   */
  async mallSelected(mall) {
    this.router.navigate(['mall-view', mall.mall_uuid], {
      state: {
        model: mall
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
