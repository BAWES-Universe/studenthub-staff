import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
//services
import { AwsService } from 'src/app/providers/aws.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
//pages
import { UploadFilePage } from '../upload-file/upload-file.page';


@Component({
  selector: 'app-company-documents',
  templateUrl: './company-documents.page.html',
  styleUrls: ['./company-documents.page.scss'],
})
export class CompanyDocumentsPage implements OnInit {

  public company_id;

  public company: Company;
  
  public borderLimit: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public awsService: AwsService,
    public companyService: CompanyService
  ) { }

  ngOnInit() {
    
    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');
    
    const state = window.history.state;

    if(state.company) {
      this.company = state.company;
    } 
      
    this.loadData();
  }

  loadData() {
    this.companyService.view(this.company_id).subscribe(data => {
      this.company = data;
    });
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
  
  /**
   * retrun type name from mime type
   * @param file_type
   */
  getFileType(file_type) {
    const types = file_type.split('/');

    if(types.length > 1)
      return types[1];
  }

  /**
   * upload company document to S3
   */
  async uploadDocument() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UploadFilePage,
      componentProps: {
        company: this.company,
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadData();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
