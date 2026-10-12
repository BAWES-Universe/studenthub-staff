import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { cloneSchema, presetConflictMatches, presetSaveApplies } from 'src/app/evaluation/evaluation-form.logic';
import { EvaluationFormService } from 'src/app/providers/logged-in/evaluation-form.service';

@Component({
  selector: 'evaluation-preset-modal',
  templateUrl: './evaluation-preset-modal.component.html',
  styleUrls: ['./evaluation-editor.component.scss']
})
export class EvaluationPresetModalComponent implements OnInit {

  public presets = [];
  public loading = true;
  public failure = '';
  public editing = null;
  public editName = '';
  public saving = false;
  public presetDirty = false;
  public presetConflict = null;
  private leaving = false;
  private saveToken = 0;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private evaluationFormService: EvaluationFormService
  ) { }

  ngOnInit() {
    this.load();
  }

  ionViewDidEnter() {
    this.modalCtrl.getTop().then(modal => {
      if (modal) {
        modal.canDismiss = () => this.allowDismiss();
      }
    });
  }

  load() {
    this.loading = true;
    this.failure = '';
    this.evaluationFormService.presets().subscribe(res => {
      this.loading = false;
      if (res && res.operation === 'success') {
        this.presets = res.presets || [];
      } else {
        this.failure = 'Presets could not be loaded.';
      }
    }, () => {
      this.loading = false;
      this.failure = 'Presets could not be loaded.';
    });
  }

  use(preset) {
    this.modalCtrl.dismiss({
      preset: {
        preset_uuid: preset.preset_uuid,
        name: preset.name,
        schema: cloneSchema(preset.schema)
      }
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async backFromEdit() {
    if (!(await this.allowDismiss())) {
      return;
    }
    this.saveToken++;
    this.saving = false;
    this.editing = null;
    this.presetDirty = false;
    this.presetConflict = null;
    this.failure = '';
  }

  markPresetDirty() {
    this.presetDirty = true;
  }

  edit(preset) {
    this.saveToken++;
    this.saving = false;
    this.presetConflict = null;
    this.failure = '';
    this.editing = {
      preset_uuid: preset.preset_uuid,
      name: preset.name,
      title: preset.name,
      evaluation_date: null,
      schema: cloneSchema(preset.schema),
      answers: {},
      revision: preset.revision || 1,
      form_status: null,
      can_manage: preset.can_manage
    };
    this.editName = preset.name;
    this.presetDirty = false;
  }

  saveEdit() {
    if (!this.editing || this.saving) {
      return;
    }
    const token = this.saveToken;
    const presetUuid = this.editing.preset_uuid;
    this.saving = true;
    this.evaluationFormService.updatePreset(
      presetUuid,
      this.editName,
      this.editing.schema,
      this.editing.revision
    ).subscribe(res => {
      this.finishPresetSave(token, presetUuid, res, false);
    }, () => {
      this.finishPresetSave(token, presetUuid, null, true);
    });
  }

  loadLatestPreset() {
    const server = this.currentConflictServer();
    if (!server) {
      return;
    }
    this.editing.schema = cloneSchema(server.schema || { properties: [] });
    this.editing.revision = server.revision;
    this.editName = server.name;
    this.presetDirty = false;
    this.presetConflict = null;
    this.failure = '';
  }

  overwritePreset() {
    const server = this.currentConflictServer();
    if (!server || server.archived_at) {
      return;
    }
    this.editing.revision = server.revision;
    this.presetConflict = null;
    this.saveEdit();
  }

  duplicate(preset) {
    this.evaluationFormService.duplicatePreset(preset.preset_uuid).subscribe(res => {
      if (res && res.operation === 'success') {
        this.load();
      } else {
        this.failure = this.message(res);
      }
    }, () => {
      this.failure = 'The preset could not be duplicated.';
    });
  }

  async archive(preset) {
    const alert = await this.alertCtrl.create({
      message: 'Archive this preset? Existing evaluations keep their own copy.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Archive', role: 'confirm' }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result.role !== 'confirm') {
      return;
    }
    this.evaluationFormService.archivePreset(preset.preset_uuid, preset.revision).subscribe(res => {
      if (res && res.operation === 'success') {
        this.presets = this.presets.filter(item => item.preset_uuid !== preset.preset_uuid);
      } else {
        this.failure = this.message(res);
      }
    }, () => {
      this.failure = 'The preset could not be archived.';
    });
  }

  private finishPresetSave(token: number, presetUuid: string, res, failed: boolean) {
    if (!presetSaveApplies(token, presetUuid, this.saveToken, this.editing ? this.editing.preset_uuid : null)) {
      return;
    }
    this.saving = false;
    if (failed) {
      this.failure = 'The preset could not be saved. Your edits are still on this page.';
      return;
    }
    if (res && res.operation === 'success') {
      this.editing = null;
      this.presetDirty = false;
      this.presetConflict = null;
      this.failure = '';
      this.load();
      return;
    }
    if (res && res.operation === 'conflict' && res.server && presetConflictMatches(res, presetUuid)) {
      this.presetConflict = res;
      this.failure = res.server.archived_at
        ? 'This preset was archived. Your edits are still here and were not saved.'
        : this.message(res);
      return;
    }
    this.failure = this.message(res);
  }

  private currentConflictServer() {
    if (!this.editing || !presetConflictMatches(this.presetConflict, this.editing.preset_uuid)) {
      return null;
    }
    return this.presetConflict.server;
  }

  private async allowDismiss() {
    if (this.leaving || !this.presetDirty) {
      return true;
    }
    const alert = await this.alertCtrl.create({
      message: 'You have unsaved preset changes. Leave them?',
      buttons: [
        { text: 'Stay', role: 'cancel' },
        { text: 'Leave', role: 'confirm' }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result.role === 'confirm') {
      this.presetDirty = false;
      return true;
    }
    return false;
  }

  private message(res) {
    if (!res) {
      return 'That action could not be completed.';
    }
    if (typeof res.message === 'string') {
      return res.message;
    }
    if (Array.isArray(res.message) && res.message[0]) {
      return res.message[0].message || 'That action could not be completed.';
    }
    return 'That action could not be completed.';
  }
}
