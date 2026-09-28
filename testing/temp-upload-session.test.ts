import * as fs from 'fs';
import * as path from 'path';
import { uploadTemporaryFile, TEMP_UPLOAD_HOST } from '../src/app/providers/temp-upload-session';

const TOKEN = 'synthetic-staff-bearer';
const PRESIGN_URL = 'https://staff.api.example.test/v1/temp-upload/url';
const OBJECT_KEY = 'photo-1.png';
const PUBLIC_URL = 'https://studenthub-public-anyone-can-upload-24hr-expiry.s3.eu-west-2.amazonaws.com/photo-1.png';
const SIGNED_URL = 'https://' + TEMP_UPLOAD_HOST + '/photo-1.png?X-Amz-Signature=synthetic-signature&X-Amz-Credential=AKIATEMPUPLOADTEST01%2F20260101%2Feu-west-2%2Fs3%2Faws4_request';

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

class FakeXhr {
    method = '';
    url = '';
    headers: Record<string, string> = {};
    sent: any = null;
    status = 0;
    aborted = false;
    upload: { onprogress: ((event: ProgressEvent) => void) | null } = { onprogress: null };
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onabort: (() => void) | null = null;

    open(method: string, url: string) {
        this.method = method;
        this.url = url;
    }

    setRequestHeader(name: string, value: string) {
        this.headers[name] = value;
    }

    send(body: any) {
        this.sent = body;
    }

    abort() {
        this.aborted = true;
        if (this.onabort) {
            this.onabort();
        }
    }

    progress(loaded: number, total: number) {
        if (this.upload.onprogress) {
            this.upload.onprogress({ lengthComputable: true, loaded, total } as ProgressEvent);
        }
    }

    succeed() {
        this.status = 200;
        if (this.onload) {
            this.onload();
        }
    }

    failStatus(status: number) {
        this.status = status;
        if (this.onload) {
            this.onload();
        }
    }

    failNetwork() {
        if (this.onerror) {
            this.onerror();
        }
    }
}

function createHarness() {
    const calls: Array<{ url: string; body: any; headers: Record<string, string> }> = [];
    const xhrs: FakeXhr[] = [];
    let pending: { next: (body: any) => void; error: (err: any) => void; unsubscribed: boolean } | null = null;

    const options = {
        file: { name: 'photo.png', type: 'image/png', size: 128 } as any,
        maxBytes: 5242880,
        oversizedMessage: 'File size should not exceed 5MB!',
        presignUrl: PRESIGN_URL,
        token: TOKEN,
        uploadHost: TEMP_UPLOAD_HOST,
        post: (url: string, body: any, headers: Record<string, string>) => {
            calls.push({ url, body, headers });
            return {
                subscribe: (next: (body: any) => void, error: (err: any) => void) => {
                    pending = { next, error, unsubscribed: false };
                    return {
                        unsubscribe: () => {
                            if (pending) {
                                pending.unsubscribed = true;
                            }
                        }
                    };
                }
            };
        },
        createRequest: () => {
            const xhr = new FakeXhr();
            xhrs.push(xhr);
            return xhr as unknown as XMLHttpRequest;
        }
    };

    return {
        calls,
        xhrs,
        options,
        resolve(body: any) {
            if (pending && !pending.unsubscribed) {
                pending.next(body);
            }
        },
        reject(err: any) {
            if (pending && !pending.unsubscribed) {
                pending.error(err);
            }
        }
    };
}

function presignBody() {
    return {
        method: 'PUT',
        upload_url: SIGNED_URL,
        key: OBJECT_KEY,
        bucket: 'studenthub-public-anyone-can-upload-24hr-expiry',
        public_url: PUBLIC_URL,
        headers: {
            'Content-Type': 'image/png',
            'x-amz-acl': 'public-read'
        },
        expires_in: 600
    };
}

function applyCaller(state: any, event: any) {
    if (event.type === 'progress') {
        state.progress = Math.round(100 * event.loaded / event.total);
    } else if (event.Key && event.Key.length > 0) {
        state.success = event;
    } else {
        state.currentTarget = event;
    }
}

function assertClean(value: string) {
    assert(value.indexOf(TOKEN) === -1, 'token leaked into ' + value);
    assert(value.indexOf('synthetic-signature') === -1, 'signed URL leaked into ' + value);
    assert(value.indexOf('X-Amz-Credential') === -1, 'credential leaked into ' + value);
    assert(value.indexOf('/aws/config') === -1, 'aws config fallback leaked into ' + value);
}

check('rejects a file over 5 MB before any request', () => {
    const harness = createHarness();
    harness.options.file = { name: 'big.png', type: 'image/png', size: 5242881 };
    const events: any[] = [];
    let error: Error | null = null;
    uploadTemporaryFile(harness.options).subscribe(
        (event) => events.push(event),
        (err) => { error = err; }
    );
    assert(harness.calls.length === 0, 'presign was called');
    assert(harness.xhrs.length === 0, 'PUT was opened');
    assert(events.length === 0, 'an event was emitted');
    assert(error !== null && error.message === 'File size should not exceed 5MB!', 'unexpected error');
    assertClean(error.message);
});

check('allows a file of exactly 5 MB to request a presign', () => {
    const harness = createHarness();
    harness.options.file = { name: 'edge.png', type: 'image/png', size: 5242880 };
    uploadTemporaryFile(harness.options).subscribe(() => undefined, () => undefined);
    assert(harness.calls.length === 1, 'presign was not called');
    assert(harness.calls[0].body.file_size === 5242880, 'size was not forwarded');
});

check('sends the bearer token only to the Staff presign URL and completes only after PUT', () => {
    const harness = createHarness();
    const state: any = { progress: 0, success: null, currentTarget: null };
    const errors: Error[] = [];
    uploadTemporaryFile(harness.options).subscribe(
        (event) => applyCaller(state, event),
        (err) => errors.push(err)
    );

    assert(state.success === null, 'success was emitted before PUT');
    assert(typeof state.currentTarget.abort === 'function', 'cancel handle was not stored');
    assert(harness.calls.length === 1, 'expected one presign call');
    assert(harness.calls[0].url === PRESIGN_URL, 'presign URL changed');
    assert(harness.calls[0].url.indexOf('/aws/config') === -1, 'presign used aws config');
    assert(harness.calls[0].headers.Authorization === 'Bearer ' + TOKEN, 'bearer header missing');
    assert(harness.calls[0].body.filename === 'photo.png', 'filename missing');
    assert(harness.calls[0].body.content_type === 'image/png', 'content type missing');
    assert(harness.xhrs.length === 0, 'PUT started before presign');

    harness.resolve(presignBody());
    assert(harness.xhrs.length === 1, 'PUT was not opened');
    assert(state.success === null, 'success was emitted before PUT status');
    const xhr = harness.xhrs[0];
    assert(xhr.method === 'PUT', 'method was not PUT');
    assert(xhr.url === SIGNED_URL, 'PUT URL was not the returned URL');
    assert(xhr.headers['Content-Type'] === 'image/png', 'PUT Content-Type mismatch');
    assert(xhr.headers['x-amz-acl'] === 'public-read', 'PUT ACL mismatch');
    assert(Object.keys(xhr.headers).indexOf('Authorization') === -1, 'bearer was sent to S3');
    assert(xhr.sent === harness.options.file, 'PUT body was not the file');

    xhr.progress(64, 128);
    assert(state.progress === 50, 'progress was not applied');
    assert(state.success === null, 'progress emitted success');

    xhr.succeed();
    assert(errors.length === 0, 'success path emitted an error');
    assert(state.success.Key === OBJECT_KEY, 'Key mismatch');
    assert(state.success.Location === PUBLIC_URL, 'Location mismatch');
    assert(state.success.Bucket === 'studenthub-public-anyone-can-upload-24hr-expiry', 'Bucket mismatch');
});

check('does not emit success when presign fails and does not fall back', () => {
    const harness = createHarness();
    const events: any[] = [];
    let error: Error | null = null;
    uploadTemporaryFile(harness.options).subscribe(
        (event) => events.push(event),
        (err) => { error = err; }
    );
    harness.reject(new Error('Http failure response for ' + SIGNED_URL + ' token ' + TOKEN));
    assert(harness.xhrs.length === 0, 'PUT was opened after presign failure');
    assert(harness.calls.length === 1, 'a fallback request was made');
    assert(harness.calls[0].url.indexOf('/aws/config') === -1, 'fallback called aws config');
    const successes = events.filter((event) => event.Key);
    assert(successes.length === 0, 'failure emitted Key');
    assert(error !== null && error.message === 'Temporary upload is unavailable.', 'raw presign error was forwarded');
    assertClean(error.message);
    assertClean(error.stack || '');
});

check('does not emit success when the PUT fails', () => {
    const harness = createHarness();
    const events: any[] = [];
    let error: Error | null = null;
    uploadTemporaryFile(harness.options).subscribe(
        (event) => events.push(event),
        (err) => { error = err; }
    );
    harness.resolve(presignBody());
    harness.xhrs[0].failStatus(403);
    assert(events.filter((event) => event.Key).length === 0, 'failed PUT emitted Key');
    assert(error !== null && error.message === 'Temporary upload failed.', 'PUT error was not sanitized');
    assertClean(error.message);
});

check('does not PUT when the presign body is not the Staff contract', () => {
    const harness = createHarness();
    let error: Error | null = null;
    uploadTemporaryFile(harness.options).subscribe(() => undefined, (err) => { error = err; });
    const body = presignBody();
    body.upload_url = 'https://example.invalid/other-bucket/file.png?X-Amz-Signature=synthetic-signature';
    harness.resolve(body);
    assert(harness.xhrs.length === 0, 'PUT was sent to an unexpected host');
    assert(error !== null && error.message === 'Temporary upload is unavailable.', 'invalid contract was accepted');
    assertClean(error.message);
});

check('currentTarget.abort during presign cancels before PUT', () => {
    const harness = createHarness();
    const state: any = { currentTarget: null, success: null };
    uploadTemporaryFile(harness.options).subscribe((event) => applyCaller(state, event), () => undefined);
    state.currentTarget.abort();
    harness.resolve(presignBody());
    assert(harness.xhrs.length === 0, 'PUT started after cancel');
    assert(state.success === null, 'cancel emitted success');
});

check('unsubscribe during presign cancels before PUT', () => {
    const harness = createHarness();
    const subscription = uploadTemporaryFile(harness.options).subscribe(() => undefined, () => undefined);
    subscription.unsubscribe();
    harness.resolve(presignBody());
    assert(harness.xhrs.length === 0, 'PUT started after unsubscribe');
});

check('currentTarget.abort during PUT prevents Key/Location completion', () => {
    const harness = createHarness();
    const state: any = { currentTarget: null, success: null, progress: 0 };
    let error: Error | null = null;
    uploadTemporaryFile(harness.options).subscribe(
        (event) => applyCaller(state, event),
        (err) => { error = err; }
    );
    harness.resolve(presignBody());
    harness.xhrs[0].progress(10, 128);
    assert(state.progress === 8, 'progress before cancel was ignored');
    state.currentTarget.abort();
    assert(harness.xhrs[0].aborted === true, 'XHR was not aborted');
    harness.xhrs[0].succeed();
    assert(state.success === null, 'completion was emitted after cancel');
    assert(error === null, 'caller cancel forwarded an error to Sentry');
});

check('a missing token makes no request', () => {
    const harness = createHarness();
    harness.options.token = '';
    let error: Error | null = null;
    uploadTemporaryFile(harness.options).subscribe(() => undefined, (err) => { error = err; });
    assert(harness.calls.length === 0, 'request was sent without a token');
    assert(error !== null && error.message === 'Temporary upload is unavailable.', 'missing token error changed');
});

check('Staff source no longer loads browser AWS credentials', () => {
    const root = process.env.STAFF_ROOT || '';
    assert(root !== '', 'STAFF_ROOT was not set');
    const service = fs.readFileSync(path.join(root, 'src/app/providers/aws.service.ts'), 'utf8');
    const moduleSource = fs.readFileSync(path.join(root, 'src/app/app.module.ts'), 'utf8');
    const transfer = fs.readFileSync(path.join(root, 'src/app/pages/logged-in/transfer/transfer-form/transfer-form.page.ts'), 'utf8');
    assert(service.indexOf('aws-sdk') === -1, 'aws-sdk import remains');
    assert(service.indexOf('/aws/config') === -1, 'aws config request remains');
    assert(service.indexOf('uploadTemporaryFile') !== -1, 'upload service does not use the presign session');
    assert(moduleSource.indexOf('awsStartupServiceFactory') === -1, 'startup still loads AWS config');
    assert(moduleSource.indexOf('/aws/config') === -1, 'startup module still mentions aws config');
    assert(transfer.indexOf('this.currentTarget = event;') !== -1, 'transfer cancel cannot see the abort handle');
});

if (failures > 0) {
    console.error('STAFF_UPLOAD_TESTS_FAILED ' + failures);
    process.exit(1);
}

console.log('STAFF_UPLOAD_TESTS_OK');
