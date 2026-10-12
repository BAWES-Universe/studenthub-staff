import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, SecurityContext, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import {
  EvaluationDraft,
  EvaluationProperty,
  PROPERTY_TYPES,
  TAG_COLORS,
  emptyAnswer,
  isSelectType,
  messageForProperty,
  moveProperty,
  newKey,
  optionById,
  propertyMeta,
  sanitizeNotesHtml,
  structureChangeNeedsConfirm,
  withoutOption
} from 'src/app/evaluation/evaluation-form.logic';

@Component({
  selector: 'evaluation-editor',
  templateUrl: './evaluation-editor.component.html',
  styleUrls: ['./evaluation-editor.component.scss']
})
export class EvaluationEditorComponent implements AfterViewChecked {

  @Input() draft: EvaluationDraft;
  @Input() staffOptions: { staff_id: number; staff_name: string }[] = [];
  @Input() mode: 'evaluation' | 'preset' = 'evaluation';
  @Input() readOnly = false;
  @Input() saving = false;
  @Input() savedAnswers: { [id: string]: any } = {};
  @Input() errors: any[] = [];
  @Input() conflictMessage = '';
  @Input() savedMessage = '';
  @Input() failureMessage = '';

  @Output() changed = new EventEmitter<void>();
  @Output() loadLatest = new EventEmitter<void>();
  @Output() overwriteLatest = new EventEmitter<void>();

  public propertyTypes = PROPERTY_TYPES;
  public colors = TAG_COLORS;
  public addOpen = false;
  public newPropertyName = '';
  public menuId: string = null;
  public optionsId: string = null;
  public choiceId: string = null;
  public confirmClear: string[] = [];
  public confirmRemove: string[] = [];

  @ViewChildren('notesBox') notesBoxes: QueryList<ElementRef>;

  constructor(
    private alertCtrl: AlertController,
    private sanitizer: DomSanitizer
  ) { }

  get locked() {
    return this.readOnly || this.saving;
  }

  @HostListener('document:click', ['$event'])
  dismissMenus(event: MouseEvent) {
    if (this.saving) {
      return;
    }
    const target = event.target as HTMLElement;
    if (!target || target.closest('.menu, .icon-button, .add-property, .choices, .options, .add-wrap')) {
      return;
    }
    this.menuId = null;
    this.addOpen = false;
    this.choiceId = null;
    this.optionsId = null;
  }

  ngAfterViewChecked() {
    if (!this.draft || !this.notesBoxes) {
      return;
    }
    this.notesBoxes.forEach(ref => {
      const id = ref.nativeElement.getAttribute('data-property-id');
      const property = this.draft.schema.properties.find(item => item.id === id);
      if (property) {
        this.paintNotes(ref.nativeElement, property);
      }
    });
  }

  meta(type: string) {
    return propertyMeta(type);
  }

  selectType(type: string) {
    return isSelectType(type);
  }

  option(property: EvaluationProperty, optionId: string) {
    return optionById(property, optionId);
  }

  selectedOptions(property: EvaluationProperty) {
    const value = this.draft.answers[property.id];
    const ids = Array.isArray(value) ? value : [];
    return ids.map(id => optionById(property, id)).filter(item => !!item);
  }

  markChanged() {
    this.changed.emit();
  }

  fieldMessage(property: EvaluationProperty) {
    return messageForProperty(this.errors, property.id);
  }

  toggleAdd() {
    if (this.locked) {
      return;
    }
    this.addOpen = !this.addOpen;
    this.newPropertyName = '';
    this.menuId = null;
    this.choiceId = null;
    this.optionsId = null;
  }

  addProperty(type: string) {
    if (this.locked) {
      return;
    }
    const typedName = (this.newPropertyName || '').trim();
    const property: EvaluationProperty = {
      id: newKey('prop'),
      name: typedName || propertyMeta(type).label,
      type,
      required: false
    };
    if (isSelectType(type)) {
      property.options = [];
    }
    this.draft.schema.properties = this.draft.schema.properties.concat([property]);
    this.draft.answers[property.id] = emptyAnswer(type);
    this.addOpen = false;
    this.newPropertyName = '';
    this.menuId = property.id;
    this.markChanged();
  }

  toggleMenu(property: EvaluationProperty) {
    if (this.locked) {
      return;
    }
    this.menuId = this.menuId === property.id ? null : property.id;
    this.addOpen = false;
    this.choiceId = null;
  }

  rename(property: EvaluationProperty, value: string) {
    if (this.locked) {
      return;
    }
    property.name = value;
    this.markChanged();
  }

  toggleRequired(property: EvaluationProperty) {
    if (this.locked) {
      return;
    }
    property.required = !property.required;
    this.markChanged();
  }

  move(index: number, direction: number) {
    if (this.locked) {
      return;
    }
    this.draft.schema.properties = moveProperty(this.draft.schema.properties, index, direction);
    this.markChanged();
  }

  async changeType(property: EvaluationProperty, type: string) {
    if (this.locked) {
      return;
    }
    if (property.type === type) {
      this.menuId = null;
      return;
    }
    if (this.structureNeedsConfirm(property)) {
      const confirmed = await this.confirm('Changing this property type clears its current answer.');
      if (!confirmed) {
        return;
      }
      this.remember(this.confirmClear, property.id);
      this.draft.answers[property.id] = emptyAnswer(type);
    }
    property.type = type;
    if (isSelectType(type)) {
      property.options = property.options || [];
    } else {
      delete property.options;
    }
    this.menuId = null;
    this.markChanged();
  }

  async removeProperty(property: EvaluationProperty) {
    if (this.locked) {
      return;
    }
    if (this.structureNeedsConfirm(property)) {
      const confirmed = await this.confirm('This property has an answer. Remove the property and delete that answer?');
      if (!confirmed) {
        return;
      }
      this.remember(this.confirmRemove, property.id);
    }
    this.draft.schema.properties = this.draft.schema.properties.filter(item => item.id !== property.id);
    delete this.draft.answers[property.id];
    this.menuId = null;
    this.markChanged();
  }

  toggleOptions(property: EvaluationProperty) {
    if (this.locked) {
      return;
    }
    this.optionsId = this.optionsId === property.id ? null : property.id;
  }

  addOption(property: EvaluationProperty) {
    if (this.locked) {
      return;
    }
    property.options = property.options || [];
    property.options.push({
      id: newKey('opt'),
      label: 'Option',
      color: this.colors[property.options.length % this.colors.length]
    });
    this.optionsId = property.id;
    this.markChanged();
  }

  async removeOption(property: EvaluationProperty, optionId: string) {
    if (this.locked) {
      return;
    }
    const value = this.draft.answers[property.id];
    const saved = this.savedAnswers ? this.savedAnswers[property.id] : null;
    const usedNow = value === optionId || (Array.isArray(value) && value.indexOf(optionId) !== -1);
    const usedSaved = saved === optionId || (Array.isArray(saved) && saved.indexOf(optionId) !== -1);
    if (this.mode === 'evaluation' && (usedNow || usedSaved)) {
      const confirmed = await this.confirm('That option is selected. Removing it drops that selection and keeps the others.');
      if (!confirmed) {
        return;
      }
      this.remember(this.confirmClear, property.id);
      if (usedNow) {
        this.draft.answers[property.id] = withoutOption(property.type, value, optionId);
      }
    }
    property.options = (property.options || []).filter(option => option.id !== optionId);
    this.markChanged();
  }

  setColor(option: { color: string }, color: string) {
    if (this.locked) {
      return;
    }
    option.color = color;
    this.markChanged();
  }

  toggleChoices(property: EvaluationProperty) {
    if (this.locked) {
      return;
    }
    this.choiceId = this.choiceId === property.id ? null : property.id;
    this.menuId = null;
    this.addOpen = false;
  }

  chooseSingle(property: EvaluationProperty, optionId: string) {
    if (this.locked) {
      return;
    }
    this.draft.answers[property.id] = optionId;
    this.choiceId = null;
    this.markChanged();
  }

  clearSingle(property: EvaluationProperty) {
    if (this.locked) {
      return;
    }
    this.draft.answers[property.id] = null;
    this.markChanged();
  }

  toggleMulti(property: EvaluationProperty, optionId: string) {
    if (this.locked) {
      return;
    }
    const current = Array.isArray(this.draft.answers[property.id]) ? this.draft.answers[property.id].slice() : [];
    const index = current.indexOf(optionId);
    if (index === -1) {
      current.push(optionId);
    } else {
      current.splice(index, 1);
    }
    this.draft.answers[property.id] = current;
    this.markChanged();
  }

  setStaff(property: EvaluationProperty, value: string) {
    if (this.locked) {
      return;
    }
    this.draft.answers[property.id] = value ? parseInt(value, 10) : null;
    this.markChanged();
  }

  setCheck(property: EvaluationProperty, checked: boolean) {
    if (this.locked) {
      return;
    }
    this.draft.answers[property.id] = checked;
    this.markChanged();
  }

  onNotes(property: EvaluationProperty, event: Event) {
    if (this.locked) {
      return;
    }
    const element = event.target as HTMLElement;
    this.draft.answers[property.id] = element.innerHTML;
    this.markChanged();
  }

  format(command: string, element: HTMLElement) {
    if (this.locked) {
      return;
    }
    element.focus();
    document.execCommand(command, false, null);
    this.draft.answers[propertyIdFrom(element)] = element.innerHTML;
    this.markChanged();
  }

  paintNotes(element: HTMLElement, property: EvaluationProperty) {
    if (document.activeElement === element) {
      return;
    }
    const html = this.safeNotes(this.draft.answers[property.id] || '');
    if (element.getAttribute('data-painted') === html) {
      return;
    }
    element.innerHTML = html;
    element.setAttribute('data-painted', html);
  }

  safeNotes(value: string) {
    const allowed = sanitizeNotesHtml(value || '');
    return this.sanitizer.sanitize(SecurityContext.HTML, allowed) || '';
  }

  private structureNeedsConfirm(property: EvaluationProperty) {
    const saved = this.savedAnswers ? this.savedAnswers[property.id] : null;
    return structureChangeNeedsConfirm(this.mode, property.type, this.draft.answers[property.id], saved);
  }

  renameOption(option: { label: string }, value: string) {
    if (this.locked) {
      return;
    }
    option.label = value;
    this.markChanged();
  }

  private remember(list: string[], id: string) {
    if (list.indexOf(id) === -1) {
      list.push(id);
    }
  }

  private async confirm(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Continue', role: 'confirm' }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'confirm';
  }
}

function propertyIdFrom(element: HTMLElement) {
  return element.getAttribute('data-property-id');
}
