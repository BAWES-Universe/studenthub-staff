import { applySuccessfulSave, blankDraft, cloneAnswers, cloneSchema, hasAnswer, messageForProperty, moveProperty, presetConflictMatches, presetFollowsSave, presetPayload, presetSaveApplies, sanitizeNotesHtml, saveResponseApplies, structureChangeNeedsConfirm, withoutOption } from './evaluation-form.logic';

describe('evaluation form logic', () => {
  const schema = {
    properties: [
      { id: 'prop_strength1', name: 'Strengths', type: 'text', required: true },
      { id: 'prop_notes0001', name: 'Notes', type: 'notes', required: false }
    ]
  };

  it('reorders properties without detaching answers', () => {
    const answers = {
      prop_strength1: 'Clear examples',
      prop_notes0001: '<p><strong>Bold</strong></p><ul><li>One</li></ul>'
    };
    const moved = moveProperty(schema.properties, 1, -1);
    expect(moved[0].id).toBe('prop_notes0001');
    expect(answers.prop_strength1).toBe('Clear examples');
    expect(answers.prop_notes0001).toContain('<strong>Bold</strong>');
  });

  it('builds a preset from structure and a blank evaluation from that preset', () => {
    const answers = { prop_strength1: 'Do not copy', prop_person001: 8 };
    const preset = presetPayload('Screening', schema);
    expect(JSON.stringify(preset)).not.toContain('Do not copy');
    expect(JSON.stringify(preset)).not.toContain('candidate');
    expect(answers.prop_strength1).toBe('Do not copy');

    const draft = blankDraft({
      name: 'Screening',
      preset_uuid: 'eval_preset_1',
      schema: preset.schema
    });
    expect(draft.answers.prop_strength1).toBeNull();
    expect(draft.evaluation_date).toBeNull();
    expect(draft.preset_name).toBe('Screening');
    draft.schema.properties[0].name = 'Changed locally';
    expect(preset.schema.properties[0].name).toBe('Strengths');
  });

  it('treats formatted empty notes as empty and real notes as filled', () => {
    expect(hasAnswer('notes', '<p><br></p>')).toBeFalse();
    expect(hasAnswer('notes', '<ul><li>Kept</li></ul>')).toBeTrue();
    expect(hasAnswer('notes', '<p>&nbsp;</p>')).toBeFalse();
    expect(hasAnswer('notes', ' \u00a0 ')).toBeFalse();
    expect(hasAnswer('number', 0)).toBeTrue();
    expect(hasAnswer('checkbox', false)).toBeFalse();
    expect(cloneSchema(schema).properties.length).toBe(2);
  });

  it('drops note event handlers and keeps the visible text', () => {
    const clean = sanitizeNotesHtml('<div onclick="window.__evalNoteRan=1"><p><strong>bold</strong></p><ul><li>kept</li></ul><script>window.__evalNoteRan=1</script></div>');
    expect(clean).not.toContain('onclick');
    expect(clean).not.toContain('__evalNoteRan');
    expect(clean).not.toContain('<script');
    expect(clean.toLowerCase()).toContain('bold');
    expect(clean.toLowerCase()).toContain('kept');
  });

  it('removes one multi-select option and keeps the others', () => {
    expect(withoutOption('multi_select', ['opt_arabic001', 'opt_englis001'], 'opt_arabic001')).toEqual(['opt_englis001']);
    expect(withoutOption('select', 'opt_arabic001', 'opt_arabic001')).toBeNull();
  });

  it('keeps text typed while a save request is still open', () => {
    const sent = blankDraft(null);
    sent.title = 'At request start';
    const current = blankDraft(null);
    current.title = 'Typed while saving';
    const server = blankDraft(null);
    server.title = 'At request start';
    server.revision = 2;
    server.interview_evaluation_uuid = 'interview_evaluation_saved';
    const kept = applySuccessfulSave(current, sent, server);
    expect(kept.dirty).toBeTrue();
    expect(kept.draft.title).toBe('Typed while saving');
    expect(kept.draft.revision).toBe(2);
    expect(kept.draft.interview_evaluation_uuid).toBe('interview_evaluation_saved');
  });

  it('keeps the saved answer after the draft answer is cleared', () => {
    const draftAnswers = { prop_concern01: 'Earlier answer', prop_langs0001: ['opt_arabic001', 'opt_englis001'] };
    const saved = cloneAnswers(draftAnswers);
    draftAnswers.prop_concern01 = '';
    draftAnswers.prop_langs0001 = [];
    expect(saved.prop_concern01).toBe('Earlier answer');
    expect(saved.prop_langs0001).toEqual(['opt_arabic001', 'opt_englis001']);
    expect(structureChangeNeedsConfirm('evaluation', 'text', draftAnswers.prop_concern01, saved.prop_concern01)).toBeTrue();
    expect(structureChangeNeedsConfirm('evaluation', 'multi_select', draftAnswers.prop_langs0001, saved.prop_langs0001)).toBeTrue();
    expect(structureChangeNeedsConfirm('evaluation', 'text', '', '')).toBeFalse();
    expect(structureChangeNeedsConfirm('preset', 'text', '', 'Earlier answer')).toBeFalse();
  });

  it('shows a validation message on the property that failed', () => {
    const errors = [
      { property_id: 'prop_phone0001', message: 'Enter a phone number for Phone.' },
      { property_id: 'prop_score0001', message: 'Enter a number for Number.' }
    ];
    expect(messageForProperty(errors, 'prop_phone0001')).toBe('Enter a phone number for Phone.');
    expect(messageForProperty(errors, 'prop_missing01')).toBe('');
    expect(messageForProperty(['The evaluation could not be saved.'], 'prop_phone0001')).toBe('');
  });

  it('does not apply one preset conflict or a delayed save to another preset', () => {
    const conflict = { server: { preset_uuid: 'preset-a', revision: 2, name: 'A' } };
    expect(presetConflictMatches(conflict, 'preset-a')).toBeTrue();
    expect(presetConflictMatches(conflict, 'preset-b')).toBeFalse();
    expect(presetConflictMatches(null, 'preset-a')).toBeFalse();
    expect(presetSaveApplies(1, 'preset-a', 1, 'preset-a')).toBeTrue();
    expect(presetSaveApplies(1, 'preset-a', 2, 'preset-b')).toBeFalse();
    expect(presetSaveApplies(1, 'preset-a', 2, null)).toBeFalse();
  });

  it('applies a save from the current visit and ignores one from an earlier visit', () => {
    expect(saveResponseApplies(1, 1)).toBeTrue();
    expect(saveResponseApplies(1, 2)).toBeFalse();
    expect(saveResponseApplies(3, 3)).toBeTrue();
  });

  it('creates a preset only after the save from this visit succeeds', () => {
    expect(presetFollowsSave(true, 1, 1)).toBeTrue();
    expect(presetFollowsSave(false, 1, 1)).toBeFalse();
    expect(presetFollowsSave(true, 1, 2)).toBeFalse();
  });
});
