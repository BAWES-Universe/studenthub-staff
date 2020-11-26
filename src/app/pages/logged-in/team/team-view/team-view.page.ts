import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// services
import { StaffService } from 'src/app/providers/logged-in/staff.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';

// models
import { Staff } from 'src/app/models/staff';
import { Note } from 'src/app/models/note';



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
  public loadMore = false;

  public pageCount = 0;
  public currentPage = 1;
  public notes: Note[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private staffService: StaffService,
    private noteService: NoteService,
  ) { }

  ngOnInit() {
    this.staffID = this.activatedRoute.snapshot.paramMap.get('id');
    const state = window.history.state;
    if (state.model) {
      this.staff = state.model;
    }
    if (!this.staff) {
      this.loadData();
    }
  }

  ionViewWillEnter() {
    if (this.staffID) {
      this.loadNoteData(1);
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

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadNoteData(page: number, loading = true) {

    this.loading = loading;

    this.noteService.listByStaff(this.currentPage, this.staffID).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.notes = response.body;
      },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * load more
   * @param event
   */
  doInfinite(event) {
    this.loadMore = true;

    this.currentPage++;
    this.noteService.listByStaff(this.currentPage, this.staffID).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.notes = this.notes.concat(response.body);
      },
      error => {
      },
      () => {
        this.loadMore = false;
        event.target.complete();
      }
    );
  }
}
