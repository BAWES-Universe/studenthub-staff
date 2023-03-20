import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// services
import { AuthService } from 'src/app/providers/auth.service';
import {Expense} from "../../../../models/expense";
import {ExpenseService} from "../../../../providers/logged-in/expense.service";
import {AwsService} from "../../../../providers/aws.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';

@Component({
  selector: 'app-expense-view',
  templateUrl: './expense-view.page.html',
  styleUrls: ['./expense-view.page.scss'],
})
export class ExpenseViewPage implements OnInit {

  public expense_uuid: string;

  public expense: Expense;

  public loading = false;

  constructor(
    private expenseService: ExpenseService,
    public analyticService: AnalyticsService,
    private activateRoute: ActivatedRoute,
    private _modalCtrl: ModalController,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public awsService: AwsService,
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Expense View Page');

    // Load the passed model if available
    if (window.history.state) {
      this.expense = window.history.state.model;
    }

    this.expense_uuid = this.activateRoute.snapshot.paramMap.get('expense_uuid');

    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.expenseService.view(this.expense_uuid).subscribe(expense => {
      this.expense = expense;

      this.loading = false;

    }, () => {

      this.loading = false;
    });
  }

  getFileUrl() {
    return this.awsService.permanentBucketUrl + 'staff-expenses/' + encodeURIComponent(this.expense.file);
  }

}
