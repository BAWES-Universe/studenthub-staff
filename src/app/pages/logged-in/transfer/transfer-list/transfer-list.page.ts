import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
//services
import { CompanyService } from 'src/app/providers/logged-in/company.service';


@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.page.html',
  styleUrls: ['./transfer-list.page.scss'],
})
export class TransferListPage implements OnInit {

  public company_id;

  public company: Company;
  
  public borderLimit: boolean = false;

  public loading: boolean = false; 

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
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
      this.company = data;

      this.loading = false;
    });
  }
  
  /**
   * Present action sheet to create a new transfer
   */
  async presentActionSheetForNewTransfer() {
    const actionSheet = await this.alertCtrl.create({
      header: 'How do you wish to create your transfer?',
      buttons: [
        {
          text: 'Manual input of hours',
          handler: () => {
            this.createNewTransfer();
          }
        },
        {
          text: 'Excel sheet upload',
          handler: () => {
            this.importTransfer();
          }
        }
      ]
    });

    actionSheet.present();
  }

  /**
   * Loads form to initiate a new transfer
   */
  createNewTransfer() {
    this.router.navigateByUrl('/transfer-form/' + this.company_id);
  }

  /**
   * Loads form to initiate a new transfer
   */
  importTransfer() {
    this.router.navigateByUrl('/import-transfer-form/' + this.company_id);
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
