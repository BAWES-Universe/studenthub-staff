import { Component, HostListener, Injectable, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController, ToastController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { EvaluationEditorComponent } from 'src/app/components/evaluation-editor/evaluation-editor.component';
import { EvaluationDraft, applySuccessfulSave, blankDraft, cloneAnswers, cloneSchema, presetFollowsSave, reloadEvaluationOnEnter, saveArrivalEffect, saveResponseApplies } from 'src/app/evaluation/evaluation-form.logic';
import { InterviewEvaluation } from 'src/app/models/interview-evaluation';
import { Note } from 'src/app/models/note';
import { AuthService } from 'src/app/providers/auth.service';
import { EvaluationFormService } from 'src/app/providers/logged-in/evaluation-form.service';
import { InterviewEvaluationService } from 'src/app/providers/logged-in/interview-evaluation.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { StaffService } from 'src/app/providers/logged-in/staff.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { InterviewEvaluationFormPage } from '../interview-evaluation-form/interview-evaluation-form.page';

@Injectable({ providedIn: 'root' })
export class EvaluationUnsavedGuard implements CanDeactivate<InterviewEvaluationViewPage> {
  canDeactivate(component: InterviewEvaluationViewPage) {
    return component.confirmLeaveIfDirty();
  }
}

@Component({
  selector: 'app-interview-evaluation-view',
  templateUrl: './interview-evaluation-view.page.html',
  styleUrls: ['./interview-evaluation-view.page.scss'],
})
export class InterviewEvaluationViewPage implements OnInit, ViewWillEnter, ViewWillLeave {

  @ViewChild(EvaluationEditorComponent) editor: EvaluationEditorComponent;

  public interview_evaluation_uuid: string;
  public candidateId: string;
  public model: InterviewEvaluation;
  public draft: EvaluationDraft;
  public savedAnswers = {};
  public openSnapshot: string = null;
  public snapshotDrafts: { [id: string]: EvaluationDraft } = {};
  public staffOptions = [];
  public structured = false;
  public legacy = false;
  public readOnly = false;
  public dirty = false;
  public saving = false;
  public loading = false;
  public errors: any[] = [];
  public conflictMessage = '';
  public savedMessage = '';
  public failureMessage = '';
  public serverCopy = null;
  public showHistory = false;
  public changes = [];
  public loadingNotes = false;
  public pageCount;
  public currentPage;
  public total;
  public borderLimit = false;
  public note_text = '';
  public savingNote = false;
  private saveResult: (saved: boolean) => void = null;
  private activeSaveId = 0;
  private replacingRoute = false;
  private saveGeneration = 0;
  private loadedVisit = -1;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public interviewEvaluationService: InterviewEvaluationService,
    public evaluationFormService: EvaluationFormService,
    public staffService: StaffService,
    public noteService: NoteService
  ) { }

  ngOnInit() {
    this.captureRoute();
    this.loadStaff();
    if (this.interview_evaluation_uuid === 'new') {
      this.prepareNewEvaluation();
    }
  }

  ionViewWillEnter() {
    if (this.replacingRoute) {
      return;
    }
    const previousUuid = this.interview_evaluation_uuid;
    this.captureRoute();
    if (this.interview_evaluation_uuid === 'new') {
      if (!this.draft) {
        this.prepareNewEvaluation();
      }
      return;
    }
    if (reloadEvaluationOnEnter(this.loadedVisit, this.saveGeneration, previousUuid !== this.interview_evaluation_uuid)) {
      this.loadData();
    }
  }

  ionViewWillLeave() {
    if (this.replacingRoute) {
      return;
    }
    this.invalidateSaveGeneration();
  }

  private captureRoute() {
    this.interview_evaluation_uuid = this.activatedRoute.snapshot.paramMap.get('interview_evaluation_uuid');
    this.candidateId = this.activatedRoute.snapshot.queryParamMap.get('candidate_id');
  }

  private prepareNewEvaluation() {
    const preset = window.history.state ? window.history.state.preset : null;
    this.draft = blankDraft(preset || null);
    this.structured = true;
    this.readOnly = false;
    this.loading = false;
    this.loadedVisit = this.saveGeneration;
  }

  private invalidateSaveGeneration() {
    this.saveGeneration += 1;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent) {
    if (this.dirty) {
      event.preventDefault();
      event.returnValue = true;
    }
  }

  loadStaff() {
    this.staffService.list(1, '&per-page=100').subscribe(res => {
      const rows = res && res.body ? res.body : [];
      this.staffOptions = rows.map(staff => ({
        staff_id: staff.staff_id,
        staff_name: staff.staff_name
      }));
    }, () => {
      this.staffOptions = [];
    });
  }

  loadData() {
    const generation = this.saveGeneration;
    this.loading = true;
    this.interviewEvaluationService.view(this.interview_evaluation_uuid).subscribe(res => {
      if (!saveResponseApplies(generation, this.saveGeneration)) {
        return;
      }
      this.loading = false;
      this.loadedVisit = generation;
      this.failureMessage = '';
      this.model = res;
      if (res && res.is_legacy === false && res.schema) {
        this.structured = true;
        this.legacy = false;
        this.draft = this.draftFromModel(res);
        this.savedAnswers = cloneAnswers(this.draft.answers);
        this.candidateId = this.candidateId || String(res.candidate_id || '');
        this.readOnly = res.form_status === 'completed';
        this.dirty = false;
      } else {
        this.structured = false;
        this.legacy = true;
        this.loadNotes();
      }
    }, () => {
      if (!saveResponseApplies(generation, this.saveGeneration)) {
        return;
      }
      this.loading = false;
      this.failureMessage = 'The evaluation could not be opened.';
    });
  }

  draftFromModel(model): EvaluationDraft {
    return {
      title: model.title || '',
      evaluation_date: model.evaluation_date || null,
      schema: model.schema || { properties: [] },
      answers: model.answers && !Array.isArray(model.answers) ? model.answers : {},
      revision: model.revision || 0,
      form_status: model.form_status || 'draft',
      preset_uuid: model.preset_uuid || null,
      preset_name: model.preset_name || null,
      interview_evaluation_uuid: model.interview_evaluation_uuid,
      candidate_id: model.candidate_id,
      created_by: model.created_by || null,
      updated_by: model.updated_by || null,
      updated_at: model.updated_at,
      completed_at: model.completed_at || null
    };
  }

  markDirty() {
    this.dirty = true;
    this.savedMessage = '';
  }

  startEdit() {
    this.readOnly = false;
  }

  async openMoreActions() {
    const buttons = [];
    if (this.draft && this.draft.form_status !== 'completed') {
      buttons.push({
        text: 'Complete evaluation',
        handler: () => this.save('complete')
      });
    }
    if (this.model && this.model.interview_evaluation_uuid) {
      buttons.push({
        text: 'Save as preset',
        handler: () => this.saveAsPreset()
      });
    }
    buttons.push({ text: 'Cancel', role: 'cancel' });
    const sheet = await this.actionSheetCtrl.create({
      header: 'Evaluation',
      buttons
    });
    await sheet.present();
  }

  save(mode: 'draft' | 'complete' | 'correction') {
    if (!this.draft || this.saving) {
      return;
    }
    this.saving = true;
    this.errors = [];
    this.failureMessage = '';
    this.conflictMessage = '';
    this.savedMessage = '';
    const sent = this.draftFromModel({
      ...this.draft,
      answers: JSON.parse(JSON.stringify(this.draft.answers || {})),
      schema: cloneSchema(this.draft.schema)
    });
    const payload = {
      mode,
      expected_revision: this.draft.revision,
      title: this.draft.title,
      evaluation_date: this.draft.evaluation_date,
      schema: this.draft.schema,
      answers: this.draft.answers,
      confirm_clear_properties: this.editor ? this.editor.confirmClear : [],
      confirm_remove_properties: this.editor ? this.editor.confirmRemove : [],
      preset_uuid: this.draft.preset_uuid
    };
    const request = this.model && this.model.interview_evaluation_uuid
      ? this.evaluationFormService.update(this.model.interview_evaluation_uuid, payload)
      : this.evaluationFormService.save(Number(this.candidateId), payload);
    const generation = this.saveGeneration;
    const requestId = ++this.activeSaveId;
    const waiter = this.saveResult;
    this.saveResult = null;

    request.subscribe(res => {
      if (saveArrivalEffect(generation, this.saveGeneration, requestId, this.activeSaveId) !== 'apply') {
        this.abandonSave(requestId, waiter);
        return;
      }
      this.saving = false;
      this.handleSaveResponse(res, sent);
      this.settleOwnWaiter(waiter, !!(res && res.operation === 'success' && !this.dirty));
    }, () => {
      if (saveArrivalEffect(generation, this.saveGeneration, requestId, this.activeSaveId) !== 'apply') {
        this.abandonSave(requestId, waiter);
        return;
      }
      this.saving = false;
      this.failureMessage = 'The evaluation could not be saved. Your entries are still on this page.';
      this.settleOwnWaiter(waiter, false);
    });
  }

  private abandonSave(requestId: number, waiter: ((saved: boolean) => void) | null) {
    if (requestId === this.activeSaveId) {
      this.saving = false;
    }
    this.settleOwnWaiter(waiter, false);
  }

  private settleOwnWaiter(waiter: ((saved: boolean) => void) | null, saved: boolean) {
    if (!waiter) {
      return;
    }
    if (this.saveResult === waiter) {
      this.saveResult = null;
    }
    waiter(saved);
  }

  handleSaveResponse(res, sent = null) {
    if (res && res.operation === 'success' && res.data) {
      const serverDraft = this.draftFromModel(res.data);
      const kept = applySuccessfulSave(this.draft, sent || this.draft, serverDraft);
      this.model = res.data;
      this.draft = kept.draft;
      this.savedAnswers = cloneAnswers(serverDraft.answers);
      this.interview_evaluation_uuid = res.data.interview_evaluation_uuid;
      this.candidateId = this.candidateId || String(res.data.candidate_id || '');
      this.dirty = kept.dirty;
      this.readOnly = !kept.dirty && res.data.form_status === 'completed';
      this.savedMessage = kept.dirty
        ? 'Saved. Changes made while saving are still on this page.'
        : (res.message || 'Saved.');
      if (this.editor && !kept.dirty) {
        this.editor.confirmClear = [];
        this.editor.confirmRemove = [];
      }
      const currentUuid = this.activatedRoute.snapshot.paramMap.get('interview_evaluation_uuid');
      if (currentUuid !== res.data.interview_evaluation_uuid) {
        this.replacingRoute = true;
        this.router.navigate(['/interview-evaluation-view', res.data.interview_evaluation_uuid], {
          queryParams: { candidate_id: this.candidateId },
          replaceUrl: true
        }).finally(() => {
          this.replacingRoute = false;
        });
      }
      this.toast(this.savedMessage);
      return;
    }
    if (res && res.operation === 'conflict') {
      this.conflictMessage = res.message;
      this.serverCopy = res.server;
      return;
    }
    this.errors = this.formatErrors(res && res.message);
  }

  applyServer() {
    if (!this.serverCopy) {
      return;
    }
    this.draft = this.draftFromModel(this.serverCopy);
    this.savedAnswers = cloneAnswers(this.draft.answers);
    this.model = this.serverCopy;
    this.dirty = false;
    this.conflictMessage = '';
    this.readOnly = this.serverCopy.form_status === 'completed';
  }

  overwriteLatest() {
    if (!this.serverCopy) {
      return;
    }
    this.draft.revision = this.serverCopy.revision;
    this.conflictMessage = '';
    const mode = this.draft.form_status === 'completed' ? 'correction' : 'draft';
    this.save(mode);
  }

  async saveAsPreset() {
    const alert = await this.alertCtrl.create({
      header: 'Save as preset',
      message: 'The evaluation is saved first, then its current properties are copied without answers.',
      inputs: [{ name: 'name', placeholder: 'Preset name', value: this.draft ? this.draft.title : '' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Save', role: 'confirm' }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result.role !== 'confirm') {
      return;
    }
    const name = result.data && result.data.values ? result.data.values.name : '';
    const generation = this.saveGeneration;
    if (!this.model || !this.model.interview_evaluation_uuid || this.dirty) {
      const mode = this.draft && this.draft.form_status === 'completed' ? 'correction' : 'draft';
      const saved = await this.saveAndWait(mode);
      if (!presetFollowsSave(saved, generation, this.saveGeneration)) {
        if (saveResponseApplies(generation, this.saveGeneration) && (this.dirty || !this.model || !this.model.interview_evaluation_uuid)) {
          this.errors = ['Save the evaluation before creating a preset. Your latest edits are still on this page.'];
        }
        return;
      }
    }
    if (!saveResponseApplies(generation, this.saveGeneration)) {
      return;
    }
    const schema = cloneSchema(this.draft.schema);
    this.evaluationFormService.createPreset(name, schema).subscribe(res => {
      if (!saveResponseApplies(generation, this.saveGeneration)) {
        return;
      }
      if (res && res.operation === 'success') {
        this.toast('Preset saved without this candidate’s answers.');
      } else {
        this.errors = this.formatErrors(res && res.message);
      }
    }, () => {
      if (!saveResponseApplies(generation, this.saveGeneration)) {
        return;
      }
      this.failureMessage = 'The preset could not be saved.';
    });
  }

  saveAndWait(mode: 'draft' | 'complete' | 'correction') {
    return new Promise<boolean>(resolve => {
      this.saveResult = resolve;
      this.save(mode);
      if (this.saveResult === resolve) {
        this.saveResult = null;
        resolve(false);
      }
    });
  }

  confirmLeaveIfDirty() {
    if (this.replacingRoute || (!this.dirty && !this.saving)) {
      return true;
    }
    return this.confirmLeave();
  }

  snapshotDraft(change) {
    const snapshot = change && change.snapshot ? change.snapshot : {};
    return this.draftFromModel({
      title: snapshot.title || '',
      evaluation_date: snapshot.evaluation_date || null,
      schema: snapshot.schema || { properties: [] },
      answers: snapshot.answers && !Array.isArray(snapshot.answers) ? snapshot.answers : {},
      revision: change.revision || 0,
      form_status: snapshot.form_status || 'draft',
      preset_name: snapshot.preset_name || null,
      preset_uuid: snapshot.preset_uuid || null
    });
  }

  toggleSnapshot(change) {
    if (this.openSnapshot === change.change_uuid) {
      this.openSnapshot = null;
      return;
    }
    if (!this.snapshotDrafts[change.change_uuid]) {
      this.snapshotDrafts[change.change_uuid] = this.snapshotDraft(change);
    }
    this.openSnapshot = change.change_uuid;
  }

  private confirmLeave() {
    return this.alertCtrl.create({
      message: 'You have unsaved changes. Leave this evaluation?',
      buttons: [
        { text: 'Stay', role: 'cancel' },
        { text: 'Leave', role: 'confirm' }
      ]
    }).then(alert => alert.present().then(() => alert.onDidDismiss())).then(result => {
      const leaving = result.role === 'confirm';
      if (leaving) {
        this.invalidateSaveGeneration();
        this.dirty = false;
      }
      return leaving;
    });
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory && this.model) {
      this.evaluationFormService.history(this.model.interview_evaluation_uuid).subscribe(res => {
        this.changes = res && res.changes ? res.changes : [];
      });
    }
  }

  async goBack() {
    if (!(await this.confirmLeaveIfDirty())) {
      return;
    }
    this.dirty = false;
    this.saving = false;
    this.navCtrl.back();
  }

  formatErrors(message): any[] {
    if (!message) {
      return [{ message: 'The evaluation could not be saved. Your entries are still on this page.' }];
    }
    if (typeof message === 'string') {
      return [{ message }];
    }
    if (Array.isArray(message)) {
      return message.map(item => {
        if (item && item.message) {
          return { property_id: item.property_id || null, message: item.message };
        }
        return { message: 'Check this field.' };
      });
    }
    return [{ message: 'The evaluation could not be saved. Your entries are still on this page.' }];
  }

  toast(message: string) {
    this.toastCtrl.create({ message, duration: 2000 }).then(toast => toast.present());
  }

  loadNotes() {
    this.loadingNotes = true;
    this.interviewEvaluationService.listVersions(this.interview_evaluation_uuid, this.currentPage).subscribe(res => {
      this.loadingNotes = false;
      this.model.interviewEvaluationNoteVersions = res.body;
      this.pageCount = parseInt(res.headers.get('X-Pagination-Page-Count'), 10);
      this.currentPage = parseInt(res.headers.get('X-Pagination-Current-Page'), 10);
      this.total = parseInt(res.headers.get('X-Pagination-Total-Count'), 10);
    });
  }

  doInfiniteInterviews(event) {
    this.loadingNotes = true;
    this.currentPage++;
    this.interviewEvaluationService.listVersions(this.interview_evaluation_uuid, this.currentPage).subscribe(res => {
      this.loadingNotes = false;
      event.target.complete();
      this.model.interviewEvaluationNoteVersions = this.model.interviewEvaluationNoteVersions.concat(res.body);
      this.pageCount = parseInt(res.headers.get('X-Pagination-Page-Count'), 10);
      this.currentPage = parseInt(res.headers.get('X-Pagination-Current-Page'), 10);
      this.total = parseInt(res.headers.get('X-Pagination-Total-Count'), 10);
    }, () => {
      this.loadingNotes = false;
      event.target.complete();
    });
  }

  async addVersion() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);
    const interviewEvaluationNotes = [];
    if (this.model.interviewEvaluationNoteVersions.length > 0) {
      this.model.interviewEvaluationNoteVersions[0].interviewEvaluationNotes.forEach(val => {
        interviewEvaluationNotes.push(val);
      });
    }
    const modal = await this.modalCtrl.create({
      component: InterviewEvaluationFormPage,
      componentProps: {
        interviewEvaluationNotes,
        model: this.model,
        candidate_id: this.model.candidate_id
      },
      cssClass: 'popup-modal'
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
      this.loadNotes();
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  addNote() {
    if (this.note_text.length == 0) {
      return null;
    }
    const note = new Note();
    note.note_text = this.note_text;
    this.savingNote = true;
    this.interviewEvaluationService.addNote(this.interview_evaluation_uuid, note).subscribe(async res => {
      this.savingNote = false;
      if (res.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService._processResponseMessage(res),
          buttons: ['Okay']
        });
        prompt.present();
      } else {
        if (!this.model.notes) {
          this.model.notes = [];
        }
        this.model.notes = [res.note].concat(this.model.notes);
        this.note_text = '';
      }
    });
  }
}
