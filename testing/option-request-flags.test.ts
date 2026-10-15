import { Subject } from 'rxjs';
import { OptionPage } from '../src/app/pages/logged-in/candidate/option/option.page';

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
  const page = new OptionPage(
    {} as any,
    {} as any,
    { createUpdateRequest: (_id: number, type: 'profile_photo' | 'civil_id') => streams[type] } as any,
    {} as any,
    { dismiss: () => Promise.resolve(true) } as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    { page() {} } as any,
    {} as any,
  );
  page.candidate = { candidate_id: 7 } as any;
  return { page, streams };
}

check('an empty photo completion leaves the civil request disabled', () => {
  const { page, streams } = setup();
  page.requestingCivil = true;
  page.requestDocument('profile_photo');
  streams.profile_photo.complete();
  assert(page.requestingPhoto === false, 'photo request stayed in flight');
  assert(page.requestingCivil === true, 'civil request was enabled');
});

check('a civil error leaves the photo request disabled', () => {
  const { page, streams } = setup();
  page.requestingPhoto = true;
  page.requestDocument('civil_id');
  streams.civil_id.error(new Error('failed'));
  assert(page.requestingCivil === false, 'civil request stayed in flight');
  assert(page.requestingPhoto === true, 'photo request was enabled');
});

check('a successful photo request leaves the civil request disabled', () => {
  const { page, streams } = setup();
  page.requestingCivil = true;
  page.requestDocument('profile_photo');
  streams.profile_photo.next({});
  streams.profile_photo.complete();
  assert(page.requestingPhoto === false, 'photo request stayed in flight');
  assert(page.requestingCivil === true, 'civil request was enabled');
});

if (failures > 0) {
  console.error('OPTION_REQUEST_FLAG_TESTS_FAILED ' + failures);
  process.exit(1);
}
