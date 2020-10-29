import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController} from "@ionic/angular";
import {UniversityService} from "src/app/providers/logged-in/university.service";
import {University} from "src/app/models/university";

@Component({
  selector: 'app-university-list',
  templateUrl: './university-list.page.html',
  styleUrls: ['./university-list.page.scss'],
})
export class UniversityListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
 
  public loading = false;
  public universities: University[];

  constructor(
    public navCtrl: NavController,
    public universityService: UniversityService
  ) {}

  ngOnInit() {
    this.loadData(this.currentPage);
  }


  /**
   * load university data
   * @param page
   */
  async loadData(page: number) {
    // Load list of university
    this.loading = true;

    this.universityService.list(page).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.universities = response.body;

      },
      error => {},
      () => {this.loading = false;}
    );
  }

  /**
   * When its selected
   */
  rowSelected(model){
    // Load Detail Page
    this.navCtrl.navigateForward('university-view/'+model.university_id, {
      state :{
        model: model
      }
    });
  }

  doInfinite(event) {
    this.loading = true;
    this.currentPage++;
    this.universityService.list(this.currentPage).subscribe(response => {

          this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
          this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

          this.universities = this.universities.concat(response.body);
        },
        error => {},
        () => {
          this.loading = false;
          event.target.complete();
        }
    );
  }
}
