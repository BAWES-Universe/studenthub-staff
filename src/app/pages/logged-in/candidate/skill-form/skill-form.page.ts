import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.page.html',
  styleUrls: ['./skill-form.page.scss'],
})
export class SkillFormPage implements OnInit {

  public skillList: Array<{ id: number, value: string }> = [];

  public txtSkill = '';
  public loading = false;
  public tmpSkill: any = [0]; // assignment initial value
  public dirty = false;
  public count = 1;
  public candidate;
  public query;
  public maxSkillsAllowed = 40;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    // this.addToSkillList(JSON.parse(JSON.stringify(this.candidate.candidateSkills)));
    console.log(this.candidate.candidateSkills);
    this.addToSkillList(this.candidate.candidateSkills);
  }

  // add skill in temp
  addToSkillList(skills) {
    if (skills && skills.length > 0) {
      skills.map((data, index) => {
        // initializing skill list and loop count

        this.skillList.push(data.skill);
        this.tmpSkill.push(index); // for loop
      });
    } else {
      // initializing skill list with zero and loop count
      this.tmpSkill[0] = null;
    }

    this.count = this.tmpSkill.length; // to check to add new textbox when type
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
   * When user hit enter on skill input
   * @param event
   * @param index
   * @param tempIndex
   */
  change(event, index, tempIndex) {

    this.query = event.target.value;

    // remove field on clearing it out + have next empty field

    if (this.count - index > 1 && event.target.value.length == 0) {
      return this.removeSkill(index, tempIndex);
    }

    // check if new field is not added && something is typed
    if (((index - this.count) === -1) && event.target.value) {
      // adding new field
      this.tmpSkill.push(this.skillList.length);
      this.count++;
    }

    this.dirty = true;
  }

  /**
   * validate skills
   */
  validateSkills() {

    let found = false, skillIndex;

    for (let i = 0; i < this.skillList.length; i++) {
      for (let j = 0; j < this.skillList.length; j++) {
        if (i != j && this.skillList[i] == this.skillList[j]) {// not same index but same value
          skillIndex = j; // remove value at j
          found = true;
          break;
        }
      }
    }

    if (found) {
      this.toastCtrl.create({
        message: 'Duplicate skill not allowed!',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());

      this.removeSkill(skillIndex, skillIndex);

      return false;
    }

    return true;
  }

  /**
   * remove skill item
   * @param skillIndex
   * @param tempIndex
   */
  removeItem(skillIndex, tempIndex) {
    this.skillList = this.skillList.filter((value, index) => index != skillIndex); // remove data from skill
    this.tmpSkill.splice(tempIndex, 1); // remove index value for loop
    this.count--; // decrease one value to compare new field
    this.tmpSkill = new Array(this.tmpSkill.length).fill(1); // resetting loop to avoid duplicate key

    this.dirty = !!(this.skillList.length); // to check if change or if its length is greater then zero
  }

  /**
   * removing skill
   * @param skillIndex
   * @param tempIndex
   */
  removeSkill(skillIndex, tempIndex) {
    this.dirty = true;

    if (tempIndex == 0) {
      if (this.skillList.length > 0) {
        this.removeItem(skillIndex, tempIndex);
      } else {
        this.skillList = [];
      }
    } else {
      this.removeItem(skillIndex, tempIndex);
    }
  }

	/**
	 * Save the model
	 */
  save() {

    if (!this.validateSkills()) {
      return false;
    }

    const ok = 'Okay';

    const skills = [];

    for (const candidateSkill of this.skillList) {
      if (candidateSkill) {
        skills.push(candidateSkill);
      }
    }

    if (skills.length == 0) {
      this.toastCtrl.create({
        message: 'Minimum One Skill is required',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());
    }

    if (skills.length > this.maxSkillsAllowed) {
      this.toastCtrl.create({
        message: 'Maximum ' + this.maxSkillsAllowed + ' skills allowed',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());
    }

    if (skills.length <= this.maxSkillsAllowed) {
      this.loading = true;
      const params = {
        skills: skills.join(',')
      };
      this.candidate.candidateSkills = skills.join(',');
      this.dismiss(params);
      // this.accountService.updateSkills(params).subscribe(jsonResponse => {
      //
      //   // On Success
      //   if (jsonResponse.operation == 'success') {
      //
      //     this.candidate.candidateSkills = jsonResponse.skills;
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
}
