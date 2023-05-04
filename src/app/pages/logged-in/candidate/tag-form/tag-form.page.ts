import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.page.html',
  styleUrls: ['./tag-form.page.scss'],
})
export class TagFormPage implements OnInit {

  public tagList = [];

  public txtTag = '';
  public loading = false;
  public tmpTags: any = [0]; // assignment initial value
  public dirty = false;
  public count = 1;
  public candidate;
  public query;
  public maxTagsAllowed = 40;

  public borderLimit = false;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Tag Form Page');

    if (this.tagList.length > 0) {
      this.tagList.map((data, index) => {
        // initializing tag list and loop count

        this.tmpTags.push(index); // for loop
      });
    } else {
      // initializing tag list with zero and loop count
      this.tmpTags[0] = null;
    }
 
    this.count = this.tmpTags.length; // to check to add new textbox when type
  }

  ionViewDidEnter() {

    if(!this.candidate.candidateTags) {
      this.candidate.candidateTags = [];
    }

    setTimeout(() => {

      const lastElementIndex = this.candidate.candidateTags.length;

      const lastElement = document.getElementById('input[' + lastElementIndex + ']') as any;

      if (lastElement && document.getElementById('input[' + lastElementIndex + ']')) {
        lastElement.setFocus();
      }
    }, 200);
  }

  /**
   * focus on next input on enter pressed
   * @param event
   * @param i
   */
  nextOnEnter(event, i) {
    if (event.which == 13) {

      i++;

      const ele = document.getElementById('input[' + i + ']') as any;

      ele.setFocus();
    }
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }

  /**
   * When user hit enter on tag input
   * @param event
   * @param index
   * @param tempIndex
   */
  change(event, index, tempIndex) {

    this.query = event.target.value;

    // remove field on clearing it out + have next empty field

    if (this.count - index > 1 && event.target.value.length == 0) {
      return this.removeTag(index, tempIndex);
    }

    // check if new field is not added && something is typed
    if (((index - this.count) === -1) && event.target.value) {
      // adding new field
      this.tmpTags.push(this.tagList.length);
      this.count++;
    }

    this.dirty = true;
  }

  /**
   * validate tags
   */
  validateTags() {

    let found = false, tagIndex;

    for (let i = 0; i < this.tagList.length; i++) {
      for (let j = 0; j < this.tagList.length; j++) {
        if (i != j && this.tagList[i] == this.tagList[j]) {// not same index but same value
          tagIndex = j; // remove value at j
          found = true;
          break;
        }
      }
    }

    if (found) {
      this.toastCtrl.create({
        message: 'Duplicate tag not allowed!',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());

      this.removeTag(tagIndex, tagIndex);

      return false;
    }

    return true;
  }

  /**
   * remove tag item
   * @param tagIndex
   * @param tempIndex
   */
  removeItem(tagIndex, tempIndex) {
    this.tagList = this.tagList.filter((value, index) => index != tagIndex); // remove data from tag
    this.tmpTags.splice(tempIndex, 1); // remove index value for loop
    this.count--; // decrease one value to compare new field
    this.tmpTags = new Array(this.tmpTags.length).fill(1); // resetting loop to avoid duplicate key

    this.dirty = !!(this.tagList.length); // to check if change or if its length is greater then zero
  }

  /**
   * removing tag
   * @param tagIndex
   * @param tempIndex
   */
  removeTag(tagIndex, tempIndex) {
    this.dirty = true;

    if (tempIndex == 0) {
      if (this.tagList.length > 0) {
        this.removeItem(tagIndex, tempIndex);
      } else {
        this.tagList = [];
      }
    } else {
      this.removeItem(tagIndex, tempIndex);
    }
  }

	/**
	 * Save the model
	 */
  save() {

    if (!this.validateTags()) {
      return false;
    }

    const ok = 'Okay';

    const tags = [];

    for (const candidateTag of this.tagList) {
      if (candidateTag) {
        tags.push(candidateTag);
      }
    }

    if (tags.length == 0) {
      this.toastCtrl.create({
        message: 'Minimum One Tag is required',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());
    }

    if (tags.length > this.maxTagsAllowed) {
      this.toastCtrl.create({
        message: 'Maximum ' + this.maxTagsAllowed + ' tags allowed',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());
    }

    if (tags.length <= this.maxTagsAllowed) {
      this.loading = true;
      const params = {
        tags: tags.join(',')
      };
      
      this.candidate.tags = tags.join(',');
      
      this.dismiss(params);

      // this.accountService.updateTags(params).subscribe(jsonResponse => {
      //
      //   // On Success
      //   if (jsonResponse.operation == 'success') {
      //
      //     this.candidate.candidateTags = jsonResponse.tags;
      //     this.dismiss();
      //   }
      //
      //   // On Failure
      //   if (jsonResponse.operation == 'error') {
      //     this.alertCtrl.create({
      //       message: this.translateService.errorMessage(jsonResponse.message),
      //       buttons: [ok]
      //     }).then(alert => alert.present());
      //   }
      // },
      //   error => {
      //   },
      //   () => {
      //     this.loading = false;
      //   });
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
