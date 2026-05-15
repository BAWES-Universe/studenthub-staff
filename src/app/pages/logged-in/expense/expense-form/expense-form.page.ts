import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { format, parseISO, addDays, subDays, isValid } from 'date-fns';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.page.html',
  styleUrls: ['./expense-form.page.scss'],
})
export class ExpenseFormPage implements OnInit {

  public expenseDate: string = format(new Date(), 'yyyy-MM-dd');
  public minDate: string = format(subDays(new Date(), 365), 'yyyy-MM-dd');
  public maxDate: string = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {}

  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'dd MMM yyyy');
  }
}
