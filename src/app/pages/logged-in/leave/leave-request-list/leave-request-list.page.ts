import { Component, OnInit } from '@angular/core';
import {StaffLeaveService} from "src/app/providers/logged-in/staff-leave.service";
import {StaffLeave} from "../../../../models/staff-leave";
import {AlertController, NavController, ToastController} from "@ionic/angular";
import {AwsService} from "../../../../providers/aws.service";

@Component({
  selector: 'app-leave-request-list',
  templateUrl: './leave-request-list.page.html',
  styleUrls: ['./leave-request-list.page.scss'],
})
export class LeaveRequestListPage implements OnInit {

  public borderLimit = false;

  public pageCount = 0;
  public totalCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadMore = false;
  public deleting = false;
  public staffLeaves: StaffLeave[] = [];

  constructor(
    public staffLeaveService: StaffLeaveService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public awsService: AwsService
  ) { }

  ngOnInit() {
    window.analytics.page('Staff Leave List');
  }

  ionViewWillEnter() {
    this.loadData(this.currentPage);
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadData(page: number, loading = true) {

    this.loading = loading;

    this.staffLeaveService.list(this.currentPage).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.staffLeaves = response.body;
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
    this.staffLeaveService.list(this.currentPage).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.staffLeaves = this.staffLeaves.concat(response.body);
      },
      error => {
      },
      () => {
        this.loadMore = false;
        event.target.complete();
      }
    );
  }

  /**
   * Delete the provided model
   */
  async delete(ev, id) {

    ev.preventDefault();
    ev.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Leave Request?',
      message: 'Are you sure you want to delete this Leave Request?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deleting = true;

            this.staffLeaveService.delete(id).subscribe(async jsonResp => {

              if (jsonResp.operation == 'error') {

                this.deleting = false;

                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  subHeader: jsonResp.message,
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {

                const toast = await this.toastCtrl.create({
                  message: jsonResp.message,
                  duration: 3000
                });
                toast.present();

                this.loadData(1, true);
              }
            }, () => {
              this.deleting = false;
            });
          }
        },
        {
          text: 'No'
        }
      ]
    });
    confirm.present();
  }

  getFileUrl(model) {
    if (model.file) {
      return this.awsService.permanentBucketUrl + 'staff-leave/' + encodeURIComponent(model.file);
    }
  }
}
