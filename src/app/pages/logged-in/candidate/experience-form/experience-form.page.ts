import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-experience-form',
  templateUrl: './experience-form.page.html',
  styleUrls: ['./experience-form.page.scss'],
})
export class ExperienceFormPage implements OnInit {

  public experienceList = [];

  public txtExperience = '';
  public loading = false;
  public tmpExperience: any = []; // assignment initial value
  public dirty = false;
  public count = 1;
  public candidate;
  public query;

  public maxExperiencesAllowed = 40;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {

    if (this.experienceList.length > 0) {
      this.experienceList.map((data, index) => {
        // initializing experience list and loop count

        this.tmpExperience.push(index); // for loop
      });
    } else {
      // initializing experience list with zero and loop count
      this.tmpExperience[0] = null;
    }

    this.count = this.tmpExperience.length; // to check to add new textbox when type
  }

  ionViewDidEnter() {

    if (!this.candidate.candidateExperiences) {
      this.candidate.candidateExperiences = [];
    }

    setTimeout(() => {

      const lastElementIndex = (this.candidate && this.candidate.candidateExperiences && this.candidate.candidateExperiences.length) ?
        this.candidate.candidateExperiences.length : 0;

      const lastElement = document.getElementById('input[' + lastElementIndex + ']') as any;

      if (lastElement) {
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
   * When user hit enter on experience input
   * @param event
   * @param index
   * @param tempIndex
   */
  change(event, index, tempIndex) {

    this.query = event.target.value;

    // remove field on clearing it out + have next empty field

    if (this.count - index > 1 && event.target.value.length == 0) {
      return this.removeExperience(index, tempIndex);
    }

    // check if new field is not added && something is typed
    if (((index - this.count) === -1) && event.target.value) {
      // adding new field
      this.tmpExperience.push(this.experienceList.length);
      this.count++;
    }

    this.dirty = true;
  }

  /**
   * validate experiences
   */
  validateExperiences() {

    let found = false, experienceIndex;

    for (let i = 0; i < this.experienceList.length; i++) {
      for (let j = 0; j < this.experienceList.length; j++) {
        if (i != j && this.experienceList[i] == this.experienceList[j]) {// not same index but same value
          experienceIndex = j; // remove value at j
          found = true;
          break;
        }
      }
    }

    if (found) {
      this.toastCtrl.create({
        message: 'Duplicate experience not allowed!',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());

      this.removeExperience(experienceIndex, experienceIndex);

      return false;
    }

    return true;
  }

  /**
   * remove experience item
   * @param experienceIndex
   * @param tempIndex
   */
  removeItem(experienceIndex, tempIndex) {
    this.experienceList = this.experienceList.filter((value, index) => index != experienceIndex); // remove data from experience
    this.tmpExperience.splice(tempIndex, 1); // remove index value for loop
    this.count--; // decrease one value to compare new field
    this.tmpExperience = new Array(this.tmpExperience.length).fill(1); // resetting loop to avoid duplicate key

    this.dirty = !!(this.experienceList.length); // to check if change or if its length is greater then zero
  }

  /**
   * removing experience
   * @param experienceIndex
   * @param tempIndex
   */
  removeExperience(experienceIndex, tempIndex) {
    this.dirty = true;

    if (tempIndex == 0) {
      if (this.experienceList.length > 0) {
        this.removeItem(experienceIndex, tempIndex);
      } else {
        this.experienceList = [];
      }
    } else {
      this.removeItem(experienceIndex, tempIndex);
    }
  }

	/**
	 * Save the model
	 */
  save() {

    if (!this.validateExperiences()) {
      return false;
    }

    const ok = 'Okay';

    const experiences = [];

    for (const candidateExperience of this.experienceList) {
      if (candidateExperience) {
        experiences.push(candidateExperience);
      }
    }

    if (experiences.length == 0) {
      this.toastCtrl.create({
        message: 'Minimum One Experience is required',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());
    }

    if (experiences.length > this.maxExperiencesAllowed) {
      this.toastCtrl.create({
        message: 'Maximum ' + this.maxExperiencesAllowed + ' experiences allowed',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());
    }

    if (experiences.length <= this.maxExperiencesAllowed) {

      this.loading = true;

      const params = {
        experiences: experiences.join(',')
      };

      this.dismiss(params);
    }
  }
}
