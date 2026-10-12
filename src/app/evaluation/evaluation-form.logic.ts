export interface EvaluationOption {
  id: string;
  label: string;
  color: string;
}

export interface EvaluationProperty {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options?: EvaluationOption[];
}

export interface EvaluationSchema {
  properties: EvaluationProperty[];
}

export interface EvaluationDraft {
  title: string;
  evaluation_date: string | null;
  schema: EvaluationSchema;
  answers: { [id: string]: any };
  revision: number;
  form_status: string | null;
  preset_uuid?: string | null;
  preset_name?: string | null;
  candidate_id?: number;
  interview_evaluation_uuid?: string;
  created_by?: { staff_id: number; staff_name: string } | null;
  updated_by?: { staff_id: number; staff_name: string } | null;
  updated_at?: string;
  completed_at?: string | null;
}

export const PROPERTY_TYPES = [
  { type: 'text', label: 'Text', icon: 'text-outline' },
  { type: 'notes', label: 'Notes', icon: 'reader-outline' },
  { type: 'number', label: 'Number', icon: 'keypad-outline' },
  { type: 'select', label: 'Single select', icon: 'list-outline' },
  { type: 'multi_select', label: 'Multi-select', icon: 'checkbox-outline' },
  { type: 'status', label: 'Status', icon: 'ellipse-outline' },
  { type: 'date', label: 'Date', icon: 'calendar-outline' },
  { type: 'staff', label: 'Staff member', icon: 'person-outline' },
  { type: 'url', label: 'URL', icon: 'link-outline' },
  { type: 'email', label: 'Email', icon: 'mail-outline' },
  { type: 'phone', label: 'Phone', icon: 'call-outline' },
  { type: 'checkbox', label: 'Checkbox', icon: 'square-outline' }
];

export const TAG_COLORS = ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'];

const SELECT_TYPES = ['select', 'multi_select', 'status'];

export function newKey(prefix: 'prop' | 'opt'): string {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const hex = Array.from(bytes).map(value => value.toString(16).padStart(2, '0')).join('');
  return prefix + '_' + hex;
}

export function cloneSchema(schema: EvaluationSchema): EvaluationSchema {
  return JSON.parse(JSON.stringify(schema || { properties: [] }));
}

export function cloneAnswers(answers: { [id: string]: any } | null | undefined) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return {};
  }
  return JSON.parse(JSON.stringify(answers));
}

export function structureChangeNeedsConfirm(mode: string, type: string, current: any, saved: any): boolean {
  if (mode !== 'evaluation') {
    return false;
  }
  return hasAnswer(type, current) || hasAnswer(type, saved);
}

export function presetConflictMatches(conflict: { server?: { preset_uuid?: string } } | null, editingUuid: string | null): boolean {
  return !!(conflict && conflict.server && editingUuid && conflict.server.preset_uuid === editingUuid);
}

export function presetSaveApplies(requestToken: number, requestUuid: string, activeToken: number, activeUuid: string | null): boolean {
  return !!activeUuid && requestToken === activeToken && requestUuid === activeUuid;
}

export function propertyMeta(type: string) {
  return PROPERTY_TYPES.find(item => item.type === type) || PROPERTY_TYPES[0];
}

export function hasAnswer(type: string, value: any): boolean {
  if (type === 'checkbox') {
    return value === true;
  }
  if (type === 'multi_select') {
    return Array.isArray(value) && value.length > 0;
  }
  if (type === 'number') {
    return value !== null && value !== undefined && value !== '';
  }
  if (typeof value === 'string') {
    return plainNotes(value) !== '';
  }
  return value !== null && value !== undefined && value !== '';
}

export function emptyAnswer(type: string) {
  if (type === 'checkbox') {
    return false;
  }
  if (type === 'multi_select') {
    return [];
  }
  return null;
}

export function moveProperty(properties: EvaluationProperty[], index: number, direction: number): EvaluationProperty[] {
  const next = index + direction;
  if (next < 0 || next >= properties.length) {
    return properties;
  }
  const copy = properties.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}

export function blankDraft(preset?: { name: string; preset_uuid: string; schema: EvaluationSchema }): EvaluationDraft {
  if (!preset) {
    return {
      title: '',
      evaluation_date: null,
      schema: { properties: [] },
      answers: {},
      revision: 0,
      form_status: 'draft',
      preset_uuid: null,
      preset_name: null
    };
  }
  const answers = {};
  cloneSchema(preset.schema).properties.forEach(property => {
    answers[property.id] = emptyAnswer(property.type);
  });
  return {
    title: preset.name,
    evaluation_date: null,
    schema: cloneSchema(preset.schema),
    answers,
    revision: 0,
    form_status: 'draft',
    preset_uuid: preset.preset_uuid,
    preset_name: preset.name
  };
}

export function presetPayload(name: string, schema: EvaluationSchema) {
  return {
    name,
    schema: cloneSchema(schema)
  };
}

export function isSelectType(type: string): boolean {
  return SELECT_TYPES.indexOf(type) !== -1;
}

export function plainNotes(value: string): string {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .trim();
}

const NOTES_ALLOWED = { p: true, br: true, strong: true, b: true, em: true, ul: true, ol: true, li: true };
const NOTES_BLOCKED = { script: true, style: true, iframe: true, object: true, embed: true };

export function sanitizeNotesHtml(value: string): string {
  const source = String(value || '').replace(/\0/g, '');
  if (!source.trim()) {
    return '';
  }
  if (typeof DOMParser === 'undefined') {
    return plainNotes(source.replace(/<(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, ''));
  }
  const document = new DOMParser().parseFromString('<div>' + source + '</div>', 'text/html');
  sanitizeNotesNode(document.body);
  return document.body.innerHTML;
}

function sanitizeNotesNode(node: Node) {
  Array.from(node.childNodes).forEach(child => sanitizeNotesNode(child));
  if (node.nodeType === Node.COMMENT_NODE && node.parentNode) {
    node.parentNode.removeChild(node);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE || !node.parentNode) {
    return;
  }
  const element = node as HTMLElement;
  const name = element.tagName.toLowerCase();
  if (name === 'body' || name === 'html') {
    return;
  }
  if (NOTES_BLOCKED[name]) {
    element.remove();
    return;
  }
  while (element.attributes.length) {
    element.removeAttribute(element.attributes[0].name);
  }
  if (!NOTES_ALLOWED[name]) {
    const parent = element.parentNode;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }
}

export function withoutOption(type: string, value: any, optionId: string) {
  if (type === 'multi_select' && Array.isArray(value)) {
    return value.filter(id => id !== optionId);
  }
  return emptyAnswer(type);
}

export function draftContent(draft: { title?: string; evaluation_date?: string; schema?: EvaluationSchema; answers?: any }) {
  return {
    title: draft.title || '',
    evaluation_date: draft.evaluation_date || null,
    schema: draft.schema || { properties: [] },
    answers: draft.answers || {}
  };
}

export function applySuccessfulSave(current: EvaluationDraft, sent: EvaluationDraft, server: EvaluationDraft) {
  const changed = JSON.stringify(draftContent(current)) !== JSON.stringify(draftContent(sent));
  if (!changed) {
    return { draft: server, dirty: false };
  }
  return {
    draft: {
      ...current,
      revision: server.revision,
      form_status: server.form_status,
      interview_evaluation_uuid: server.interview_evaluation_uuid,
      candidate_id: server.candidate_id || current.candidate_id,
      created_by: server.created_by,
      updated_by: server.updated_by,
      updated_at: server.updated_at,
      completed_at: server.completed_at
    },
    dirty: true
  };
}

export function messageForProperty(errors: any[] | null | undefined, propertyId: string): string {
  const list = errors || [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item && typeof item === 'object' && item.property_id === propertyId && item.message) {
      return item.message;
    }
  }
  return '';
}

export function optionById(property: EvaluationProperty, optionId: string): EvaluationOption | null {
  const options = property.options || [];
  for (let i = 0; i < options.length; i++) {
    if (options[i].id === optionId) {
      return options[i];
    }
  }
  return null;
}
