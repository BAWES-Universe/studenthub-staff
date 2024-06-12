import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// models
import { Ticket } from 'src/app/models/ticket';
import { TicketComment } from 'src/app/models/ticket_comment';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { TicketService } from 'src/app/providers/logged-in/ticket.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AwsService } from 'src/app/providers/aws.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { Camera2Service } from 'src/app/providers/logged-in/camera2.service';


@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.page.html',
  styleUrls: ['./ticket-view.page.scss'],
})
export class TicketViewPage implements OnInit {

  public ticket_uuid: string;

  public ticket: Ticket;

  public ticketComments = [];

  public saving = false;

  public loading = false;

  public loadingComment = false;

  public borderLimit;

  public form: FormGroup;

  @ViewChild('ckeditor') ckeditor;

  public Editor = ClassicEditor;

  public editorConfig;

  public attachments = [];

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public allowedImageSize = 5000000; // in bits 5 MB

  public currentTarget;

  public uploadingPhoto;

  public progress;

  public interval;

  public uploadFileSubscription;

  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public ticketService: TicketService,
    private platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public awsService: AwsService,
    public sentryService: SentryErrorhandlerService,
    private camera2Service: Camera2Service
  ) {
    this.ticket_uuid = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit() {
    this.editorConfig = {
      toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
      height: '25em'
    };
    if (this.ticket_uuid) {7
      this.loadData();
    }
  }

  /**
   * load data
   */
  loadData() {

    this.loading = true;

    this.ticketService.view(this.ticket_uuid).subscribe(response => {
      this.loading = false;

      this.ticket = response;
      this.ticketComments = response.ticketComments;
      this.initForm();
    });
  }

  /**
   * load comments
   */
  loadComments() {

    this.loadingComment = true;

    this.ticketService.listComments(this.ticket_uuid).subscribe(response => {

      this.loadingComment = false;

      this.ticketComments = response;
    });
  }

  /**
   * initialize form
   */
  initForm() {
    this.form = this.formBuilder.group({
      comment_detail: ['', Validators.required],
    });
  }

  /**
   * on note editor change
   * @param event
   */
   onChange(event) {

    if (!event.editor) {
      return event;
    }

    const data = event.editor.getData();

    this.form.controls.comment_detail.setValue(data);

    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  /**
   * save comment
   */
  save() {

    this.saving = true;

    const modal = new TicketComment;
    modal.ticket_uuid = this.ticket_uuid;
    modal.ticket_comment_detail = this.form.value.comment_detail;
    modal.status = this.ticket.ticket_status;

    this.ticketService.comment(modal, this.attachments).subscribe(res => {

      if (res.operation == 'success') {

        this.attachments = [];

        this.form.reset();
 
        this.ckeditor.writeValue("");

        this.loadComments();

      } else {

        this.alertCtrl.create({
          // header: this.translateService.transform('Errors'),
          message: this.authService.errorMessage(res.message)
        }).then(toast => {
          toast.present();
        });
      }

    },
      err => this.saving = false,
      () => this.saving = false,
    );
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }

  /**
   * Upload logo from mobile
   */
   mobileUpload() {

    const SelectSourceLbl = this.translateService.transform('Select image source');
    const LoadLibLbl = this.translateService.transform('Load from Library');
    const UseCamLbl = this.translateService.transform('Use Camera');

    const arrButtons = [
      {
        text: LoadLibLbl,
        handler: () => {

          this.camera2Service.getImageFromLibrary().then((image) => {

            console.log('camera output', image);

            // Upload and process for progress
            this.uploadFileViaNativeFilePath(image);
          }, async (err) => {

            const ignoreErrors = [
              'No image picked',
              'User cancelled photos app'
            ];

            if (err && ignoreErrors.indexOf(err.message) > -1) {
              return null;
            }

            const alert = await this.alertCtrl.create({
              header: this.translateService.transform('Error getting picture from Library'),
              message: err.message,
              buttons: [this.translateService.transform('Okay')]
            });

            await alert.present();
          });
        }
      },
      {
        text: UseCamLbl,
        handler: () => {

          this.camera2Service.getImageFromCamera().then((image) => {
            // Upload and process for progress
            this.uploadFileViaNativeFilePath(image);
          }, async (err) => {

            const ignoreErrors = [
              'No image picked',
              'User cancelled photos app'
            ];

            if (err && ignoreErrors.indexOf(err.message) > -1) {
              return null;
            }

            const alert = await this.alertCtrl.create({
              header: this.translateService.transform('Error getting picture from Library'),
              message: err.message,
              buttons: [this.translateService.transform('Okay')]
            });

            await alert.present();
          });
        }
      }
    ];

    /*if (this.form.controls.personal_photo.value) {
      arrButtons.push({
        text: this.translateService.transform('Remove Photo'),
        handler: () => {
          this.removePhoto();
        }
      });
    }*/

    // Display action sheet giving user option of camera vs local filesystem.
    this.actionSheetCtrl.create({
      header: SelectSourceLbl,
      buttons: arrButtons
    }).then(actionSheet => actionSheet.present());
  }

  /**
   * Upload logo by native path
   */
  async uploadFileViaNativeFilePath(image) {

    this.uploadingPhoto = true;

    this.awsService.uploadNativePath(image).then(o => {
      o.subscribe(event => {
        this._handleFileSuccess(event);
      }, async err => {

        console.error(err);

        this.progress = 0;
        clearInterval(this.interval);
        this.uploadingPhoto = false;

        const ignoreErrors = [
          'No image picked',
          'User cancelled photos app',
        ];

        if (
          err && (
            ignoreErrors.indexOf(err.message) > -1 ||
            err.message.includes('aborted')
          )
        ) {
          return null;
        }

        // log to slack/sentry to know how many user getting file upload error

        this.sentryService.handleError(err);

        // always show abstract error message

        let message;

        const networkErrors = [
          '504:null',
          'NetworkingError: Network Failure'
        ];

        // networking errors
        if (err && networkErrors.indexOf(err.message) > -1) {
          message = this.translateService.transform('Error uploading file');
          // system errors
        } else if (err.message && err.message.indexOf(':') > -1) {
          message = this.translateService.transform('Error getting file from Library');
          // plugin errors
        } else if (err.message) {
          message = err.message;
          // custom file validation errors
        } else {
          message = err;
        }

        const alert = await this.alertCtrl.create({
          header: this.translateService.transform('Error'),
          message,
          buttons: [this.translateService.transform('Okay')]
        });

        await alert.present();
      });
    }, err => {
      console.error(err);

    });
  }

  /**
   * Upload logo from browser
   * @param event
   */
  async browserUpload(event) {

    const fileList: FileList = event.target.files;

    if (fileList.length == 0) {
      return false;
    }
    const prefix = fileList[0].name.split('.')[0];

    const type = fileList[0].type.split('/')[0];

    if (type != 'image') {
      this.alertCtrl.create({
        message: this.translateService.transform('Invalid File format'),
        buttons: [this.translateService.transform('Ok')]
      }).then(alert => { alert.present(); });
    }else if (fileList[0].size > this.allowedImageSize) {
      this.alertCtrl.create({
        message: this.translateService.transform('Maximum 5mb Upload is allowed'),
        buttons: [this.translateService.transform('Ok')]
      }).then(alert => { alert.present(); });
    } else {

      this.uploadingPhoto = true;

      this.uploadFileSubscription = this.awsService.uploadFile(fileList[0]).subscribe(event => {
        this._handleFileSuccess(event);
      }, async err => {

        if (!err.message || !err.message.includes('aborted')) {
          // log to sentry

          this.sentryService.handleError(err);

          const alert = await this.alertCtrl.create({
            header: this.translateService.transform('Error'),
            message: this.translateService.transform('Error while uploading file!'),
            buttons: [this.translateService.transform('Okay')]
          });

          await alert.present();
        }

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = null;
        }
        this.uploadingPhoto = false;
        this.progress = 0;
        clearInterval(this.interval);
      }, () => {
        this.uploadFileSubscription.unsubscribe();
      });
    }
  }

  /**
   * Handle logo upload api response
   * @param event
   */
  _handleFileSuccess(event) {
    let count = 1;

    /*if (!this.interval) {

      this.interval = setInterval(() => {
        this._ngzone.run(() => {
          if (count < 100) {
            this.progress = count = count + 1;
          }
        });
      }, 35);
    }*/

    // Via this API, you get access to the raw event stream.
    // Look for upload progress events.

    if (event.type === 'progress') {
      // This is an upload progress event. Compute and show the % done:
      // this.progress = Math.round(100 * event.loaded / event.total);
    } else if (event.Key && event.Key.length > 0) {

      if (this.fileInput && this.fileInput.nativeElement) {
        this.fileInput.nativeElement.value = null;
      }

      //this.form.controls.personal_photo_path.setValue(event.Location);
      //this.form.controls.personal_photo.setValue(event.Key);

      this.attachments.push(event);

      this.uploadingPhoto = false;

    } else if (!this.currentTarget) {
      this.currentTarget = event;
    }
  }

  /**
   * trigger click event on change logo button
   */
  triggerUpdatePhoto($event) {
    $event.stopPropagation();
    document.getElementById('upload-pic').click();
    // this.fileInput.nativeElement.click();
  }

  /**
   * cancel file upload
   */
  cancelUpload() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }

    this.progress = 0;
    clearInterval(this.interval);
    //this.loading = false;

    if (this.currentTarget) {
      this.currentTarget.abort();
    }
  }

  /**
   * Display options to update photo
   */
   async updatePhoto(ev) {
    if (this.platform.is('capacitor')) {
      this.mobileUpload();
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * remove photo
   * @param userPhoto
   * @param index
   * @returns
   */
  removePhoto(userPhoto, index) {

    this.attachments = this.attachments.filter((data, i) => {
      return i != index
    });
  }

  changeStatus(status) {
    this.ticket.ticket_status = status;
  }
}
