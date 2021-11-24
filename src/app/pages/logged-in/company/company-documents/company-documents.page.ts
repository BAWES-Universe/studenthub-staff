import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
//services
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
//pages
import { UploadFilePage } from '../upload-file/upload-file.page';


@Component({
  selector: 'app-company-documents',
  templateUrl: './company-documents.page.html',
  styleUrls: ['./company-documents.page.scss'],
})
export class CompanyDocumentsPage implements OnInit {

  public company: Company;

  public borderLimit: boolean = false;
  public loading = false;

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public awsService: AwsService,
    public eventService: EventService,
    public companyService: CompanyService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.companyService.view(this.company.company_id, 'files').subscribe(data => {
      this.loading = false;
      this.company = data;
    });
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

  /**
   * retrun type name from mime type
   * @param file
   */
  getFileType(file) {

    const extension = this.awsService.getFileExtension(file.file_s3_path);

    if(extension) 
      return extension;

    //if no extension, user mime type 
    
    const types = file.file_type.split('/');

    if(types.length > 1 && types[1].length > 0) {

      //spreadsheet officedocument
      if(types[1].includes('spreadsheet')) {
        return 'spreadsheet';
      }
      
      return types[1];
    }

    return 'Document';
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

      this.eventService.reloadStats$.next({
        company_id: this.company.company_id
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
