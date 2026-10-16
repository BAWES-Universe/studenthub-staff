import { Subject } from 'rxjs';
import { OptionPage } from '../src/app/pages/logged-in/candidate/option/option.page';

if (typeof (globalThis as any).window === 'undefined') {
  (globalThis as any).window = globalThis;
}

let failures = 0;

function check(name: string, fn: () => void) {
  try {
    fn();
    console.log('PASS ' + name);
  } catch (err) {
    failures += 1;
    console.error('FAIL ' + name);
    console.error(err instanceof Error ? err.stack : err);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function setup() {
  const streams = {
    profile_photo: new Subject<unknown>(),
    civil_id: new Subject<unknown>(),
  };
  const keys: string[] = [];
  const toasts: string[] = [];
  const page = new OptionPage(
    {} as any,
    {} as any,
    {
      createUpdateRequest: (_id: number, type: 'profile_photo' | 'civil_id', sendKey: string) => {
        keys.push(sendKey);
        return streams[type];
      },
    } as any,
    {} as any,
    { dismiss: () => Promise.resolve(true) } as any,
    {} as any,
    {} as any,
    {
      create: async (options: { message?: string }) => {
        toasts.push(options.message || '');
        return { present() {} };
      },
    } as any,
    {} as any,
    { page() {} } as any,
    {} as any,
  );
  page.candidate = { candidate_id: 7 } as any;
  return { page, streams, keys, toasts };
}

check('an empty photo completion reports failure and keeps its send key', () => {
  const { page, streams, keys, toasts } = setup();
  page.requestingCivil = true;
  page.requestDocument('profile_photo');
  const firstKey = keys[0];
  streams.profile_photo.complete();
  assert(page.requestingPhoto === false, 'photo request stayed in flight');
  assert(page.requestingCivil === true, 'civil request was enabled');
  assert(toasts[0] === 'Could not send the notification. Please try again.', 'empty completion showed no failure');
  page.requestDocument('profile_photo');
  assert(keys[1] === firstKey, 'retry used a new send key');
});

check('a civil error reports failure and leaves the photo request disabled', () => {
  const { page, streams, keys, toasts } = setup();
  page.requestingPhoto = true;
  page.requestDocument('civil_id');
  const firstKey = keys[0];
  streams.civil_id.error(new Error('failed'));
  assert(page.requestingCivil === false, 'civil request stayed in flight');
  assert(page.requestingPhoto === true, 'photo request was enabled');
  assert(toasts[0] === 'Could not send the notification. Please try again.', 'error showed no failure');
  page.requestDocument('civil_id');
  assert(keys[1] === firstKey, 'retry used a new send key');
});

check('a successful photo request leaves the civil request disabled', () => {
  const { page, streams } = setup();
  page.requestingCivil = true;
  page.requestDocument('profile_photo');
  streams.profile_photo.next({ operation: 'success' });
  streams.profile_photo.complete();
  assert(page.requestingPhoto === false, 'photo request stayed in flight');
  assert(page.requestingCivil === true, 'civil request was enabled');
});

check('a failed photo request keeps its send key and the civil request disabled', () => {
  const { page, streams, keys } = setup();
  page.requestingCivil = true;
  page.requestDocument('profile_photo');
  const firstKey = keys[0];
  streams.profile_photo.next({ operation: 'error' });
  streams.profile_photo.complete();
  page.requestDocument('profile_photo');
  assert(keys[1] === firstKey, 'retry used a new send key');
  assert(page.requestingCivil === true, 'civil request was enabled');
});

check('photo and civil requests stay independent', () => {
  const { page, streams, keys } = setup();
  page.requestDocument('profile_photo');
  page.requestDocument('civil_id');
  assert(page.requestingPhoto === true, 'photo request was blocked');
  assert(page.requestingCivil === true, 'civil request was blocked');
  assert(keys[0] !== keys[1], 'both requests shared one send key');
  const civilKey = keys[1];
  streams.profile_photo.error(new Error('failed'));
  assert(page.requestingPhoto === false, 'photo request stayed in flight');
  assert(page.requestingCivil === true, 'civil request was cleared with the photo failure');
  page.requestDocument('profile_photo');
  assert(keys[2] === keys[0], 'photo retry used a new send key');
  assert(keys[1] === civilKey, 'civil send key changed');
});

if (failures > 0) {
  console.error('OPTION_REQUEST_FLAG_TESTS_FAILED ' + failures);
  process.exit(1);
}
