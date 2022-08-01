import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

//services
import { AuthService } from 'src/app/providers/auth.service';
import { StoryService } from '../../../../providers/logged-in/story.service';
import {EventService} from "../../../../providers/event.service";


@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.page.html',
  styleUrls: ['./story-list.page.scss'],
})
export class StoryListPage implements OnInit {

  public borderLimit = false;
  public storyStatus = 'all';
  public pageCount = 0;
  public currentPage = 1;
  public total;
  public loading = false;
  public loadMore = false;
  public deleting = false;
  public stories: any[] = [];

  constructor(
    public authService: AuthService,
    private storyService: StoryService,
    private eventService: EventService,
    private navCtrl: NavController,
    public platform: Platform,
  ) {
    this.eventService.storyStatusUpdated$.next( res => {
      this.loadData(1);
    });
  }

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadData(page: number, loading = true) {

    this.loading = loading;

    let param = '&expand=staff,request,request.company';
    if (this.storyStatus) {
      param += '&story_status=' + this.storyStatus;
    }
    this.storyService.list(this.currentPage, param).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.stories = response.body;
    },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('story-view/' + model.story_uuid, {
      state: {
        model
      }
    });
  }

  /**
   * load more
   * @param event
   */
  doInfinite(event) {
    this.loadMore = true;

    this.currentPage++;

    let param = '&expand=staff,request,request.company';
    if (this.storyStatus) {
      param += '&story_status=' + this.storyStatus;
    }

    this.storyService.list(this.currentPage, param).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.stories = this.stories.concat(response.body);
    },
      error => {
      },
      () => {
        this.loadMore = false;
        event.target.complete();
      }
    );
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  filter(status) {
    this.storyStatus = status;
    this.loadData(1);
  }
}
