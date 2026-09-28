import * as Sentry from '@sentry/browser';
import { redactPresignedUploadBreadcrumb, redactPresignedUploadUrl } from '../src/app/providers/sentry-presign-redaction';
import { TEMP_UPLOAD_HOST } from '../src/app/providers/temp-upload-session';

const SIGNATURE = 'synthetic-signature-value';
const CREDENTIAL = 'AKIATEMPUPLOADTEST01/20260101/eu-west-2/s3/aws4_request';
const SIGNED_URL = 'https://' + TEMP_UPLOAD_HOST
    + '/photo-1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential='
    + encodeURIComponent(CREDENTIAL)
    + '&X-Amz-Date=20260101T000000Z&X-Amz-Expires=600&X-Amz-Signature='
    + SIGNATURE
    + '&X-Amz-SignedHeaders=host%3Bx-amz-acl';
const ORDINARY_URL = 'https://staff.api.example.test/v1/companies/file-create/538';

let failures = 0;

function check(name: string, fn: () => void | Promise<void>) {
    return Promise.resolve()
        .then(fn)
        .then(() => {
            console.log('PASS ' + name);
        })
        .catch((err) => {
            failures += 1;
            console.error('FAIL ' + name);
            console.error(err instanceof Error ? err.stack : err);
        });
}

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(message);
    }
}

function envelopeText(envelopes: any[]): string {
    return JSON.stringify(envelopes);
}

async function main() {
    await check('redaction leaves the upload URL sent to S3 unchanged', () => {
        const uploadUrl = SIGNED_URL;
        const breadcrumb = {
            category: 'xhr',
            type: 'http',
            data: {
                method: 'PUT',
                url: uploadUrl,
                status_code: 200
            }
        };
        const redacted = redactPresignedUploadBreadcrumb(breadcrumb);
        assert(uploadUrl === SIGNED_URL, 'original upload URL was modified');
        assert(breadcrumb.data.url === SIGNED_URL, 'breadcrumb input URL was modified');
        assert(redacted.data.method === 'PUT', 'method was dropped');
        assert(redacted.data.status_code === 200, 'status was dropped');
        assert(redacted.data.url.indexOf(SIGNATURE) === -1, 'signature remained in breadcrumb');
        assert(redacted.data.url.indexOf(CREDENTIAL) === -1, 'credential remained in breadcrumb');
        assert(redacted.data.url.indexOf('X-Amz-Expires=600') !== -1, 'non-sensitive query was dropped');
        assert(redactPresignedUploadUrl(ORDINARY_URL) === ORDINARY_URL, 'ordinary URL was changed');
    });

    await check('mocked Sentry transport receives redacted breadcrumbs and ordinary telemetry', async () => {
        const envelopes: any[] = [];
        Sentry.init({
            dsn: 'https://public@o0.ingest.sentry.io/0',
            defaultIntegrations: false,
            autoSessionTracking: false,
            sendClientReports: false,
            beforeBreadcrumb: (breadcrumb) => redactPresignedUploadBreadcrumb(breadcrumb),
            transport: () => ({
                send: (envelope) => {
                    envelopes.push(envelope);
                    return Promise.resolve({});
                },
                flush: () => Promise.resolve(true)
            })
        });

        Sentry.addBreadcrumb({
            category: 'xhr',
            type: 'http',
            data: {
                method: 'PUT',
                url: SIGNED_URL,
                status_code: 200
            }
        });
        Sentry.addBreadcrumb({
            category: 'xhr',
            type: 'http',
            data: {
                method: 'POST',
                url: ORDINARY_URL,
                status_code: 401
            }
        });
        Sentry.captureMessage('synthetic telemetry check');
        const client = Sentry.getCurrentHub().getClient();
        assert(!!client, 'Sentry client was not created');
        await client.flush(2000);

        const payload = envelopeText(envelopes);
        assert(envelopes.length > 0, 'mock transport received no event');
        assert(payload.indexOf(SIGNATURE) === -1, 'signature was captured');
        assert(payload.indexOf(encodeURIComponent(CREDENTIAL)) === -1, 'encoded credential was captured');
        assert(payload.indexOf(CREDENTIAL) === -1, 'credential was captured');
        assert(payload.indexOf('PUT') !== -1, 'PUT method was removed');
        assert(payload.indexOf('200') !== -1, 'PUT status was removed');
        assert(payload.indexOf(ORDINARY_URL) !== -1, 'ordinary telemetry was removed');
        assert(payload.indexOf('401') !== -1, 'ordinary status was removed');
        await client.close(2000);
    });

    await check('console breadcrumbs redact embedded signed URLs without mutating arguments', () => {
        const detail = { upload: SIGNED_URL, label: 'keep me' };
        const args = ['upload failed:', SIGNED_URL, detail];
        const breadcrumb = {
            category: 'console',
            level: 'error',
            message: 'upload failed: ' + SIGNED_URL,
            data: {
                message: 'detail ' + SIGNED_URL,
                arguments: args,
                logger: 'console'
            }
        };
        const redacted = redactPresignedUploadBreadcrumb(breadcrumb);

        assert(SIGNED_URL.indexOf(SIGNATURE) !== -1, 'fixture lost its signature');
        assert(args[1] === SIGNED_URL, 'original argument was modified');
        assert(detail.upload === SIGNED_URL, 'original object argument was modified');
        assert(breadcrumb.message.indexOf(SIGNATURE) !== -1, 'original message was modified');
        assert(breadcrumb.data.arguments === args, 'original arguments array was replaced');
        assert(args[2] === detail, 'original object was replaced in the input');
        assert(redacted !== null, 'sanitizable console breadcrumb was dropped');
        assert(redacted.message.indexOf(SIGNATURE) === -1, 'signature remained in message');
        assert(redacted.message.indexOf(CREDENTIAL) === -1, 'credential remained in message');
        assert(redacted.message.indexOf('upload failed:') !== -1, 'console message text was removed');
        assert(redacted.data.message.indexOf(SIGNATURE) === -1, 'signature remained in data.message');
        assert(redacted.data.arguments[0] === 'upload failed:', 'unrelated argument changed');
        assert(redacted.data.arguments[1].indexOf(SIGNATURE) === -1, 'signature remained in arguments');
        assert(redacted.data.arguments[1].indexOf(CREDENTIAL) === -1, 'credential remained in arguments');
        assert(redacted.data.arguments[2].upload.indexOf(SIGNATURE) === -1, 'signature remained in object argument');
        assert(redacted.data.arguments[2].label === 'keep me', 'unrelated object field changed');
        assert(redacted.data.logger === 'console', 'console logger was removed');
        assert(redacted.data.arguments !== breadcrumb.data.arguments, 'arguments array was mutated in place');
    });

    await check('a signed URL in an object that cannot be copied drops the breadcrumb', () => {
        function UploadBox(url) {
            this.url = url;
        }
        const box = new UploadBox(SIGNED_URL);
        const breadcrumb = {
            category: 'console',
            message: 'upload failed',
            data: {
                arguments: [box],
                logger: 'console'
            }
        };
        const redacted = redactPresignedUploadBreadcrumb(breadcrumb);
        assert(redacted === null, 'unsafe console breadcrumb was kept');
        assert(box.url === SIGNED_URL, 'dropped breadcrumb mutated the original object');
    });

    await check('mocked transport redacts console-shaped signed URLs and keeps XHR telemetry', async () => {
        const envelopes: any[] = [];
        Sentry.init({
            dsn: 'https://public@o0.ingest.sentry.io/0',
            defaultIntegrations: false,
            autoSessionTracking: false,
            sendClientReports: false,
            beforeBreadcrumb: (breadcrumb) => redactPresignedUploadBreadcrumb(breadcrumb),
            transport: () => ({
                send: (envelope) => {
                    envelopes.push(envelope);
                    return Promise.resolve({});
                },
                flush: () => Promise.resolve(true)
            })
        });

        Sentry.addBreadcrumb({
            category: 'xhr',
            type: 'http',
            data: {
                method: 'PUT',
                url: SIGNED_URL,
                status_code: 200
            }
        });
        Sentry.addBreadcrumb({
            category: 'console',
            level: 'error',
            message: 'upload failed: ' + SIGNED_URL,
            data: {
                arguments: ['upload failed:', SIGNED_URL, { upload: SIGNED_URL }],
                logger: 'console'
            }
        });
        Sentry.addBreadcrumb({
            category: 'xhr',
            type: 'http',
            data: {
                method: 'POST',
                url: ORDINARY_URL,
                status_code: 401
            }
        });
        Sentry.captureMessage('synthetic console telemetry check');
        const client = Sentry.getCurrentHub().getClient();
        assert(!!client, 'Sentry client was not created');
        await client.flush(2000);

        const payload = envelopeText(envelopes);
        assert(envelopes.length > 0, 'mock transport received no event');
        assert(payload.indexOf(SIGNATURE) === -1, 'signature was captured from a console breadcrumb');
        assert(payload.indexOf(encodeURIComponent(CREDENTIAL)) === -1, 'encoded credential was captured');
        assert(payload.indexOf(CREDENTIAL) === -1, 'credential was captured');
        assert(payload.indexOf('upload failed:') !== -1, 'console message was removed');
        assert(payload.indexOf('PUT') !== -1, 'PUT method was removed');
        assert(payload.indexOf('200') !== -1, 'PUT status was removed');
        assert(payload.indexOf(ORDINARY_URL) !== -1, 'ordinary telemetry was removed');
        assert(payload.indexOf('401') !== -1, 'ordinary status was removed');
        await client.close(2000);
    });

    await check('mocked transport drops a breadcrumb that logs the same object twice', async () => {
        const envelopes: any[] = [];
        const detail = { upload: SIGNED_URL };
        Sentry.init({
            dsn: 'https://public@o0.ingest.sentry.io/0',
            defaultIntegrations: false,
            autoSessionTracking: false,
            sendClientReports: false,
            beforeBreadcrumb: (breadcrumb) => redactPresignedUploadBreadcrumb(breadcrumb),
            transport: () => ({
                send: (envelope) => {
                    envelopes.push(envelope);
                    return Promise.resolve({});
                },
                flush: () => Promise.resolve(true)
            })
        });

        Sentry.addBreadcrumb({
            category: 'console',
            level: 'error',
            message: 'upload failed',
            data: {
                arguments: [detail, detail],
                logger: 'console'
            }
        });
        Sentry.addBreadcrumb({
            category: 'xhr',
            type: 'http',
            data: {
                method: 'POST',
                url: ORDINARY_URL,
                status_code: 401
            }
        });
        Sentry.captureMessage('synthetic repeated object check');
        const client = Sentry.getCurrentHub().getClient();
        assert(!!client, 'Sentry client was not created');
        await client.flush(2000);

        const payload = envelopeText(envelopes);
        assert(envelopes.length > 0, 'mock transport received no event');
        assert(detail.upload === SIGNED_URL, 'repeated object was mutated');
        assert(payload.indexOf(SIGNATURE) === -1, 'signature was captured from a repeated object');
        assert(payload.indexOf(encodeURIComponent(CREDENTIAL)) === -1, 'encoded credential was captured from a repeated object');
        assert(payload.indexOf(CREDENTIAL) === -1, 'credential was captured from a repeated object');
        assert(payload.indexOf(ORDINARY_URL) !== -1, 'ordinary telemetry was removed');
        assert(payload.indexOf('401') !== -1, 'ordinary status was removed');
        await client.close(2000);
    });

    if (failures > 0) {
        console.error('SENTRY_REDACTION_TESTS_FAILED ' + failures);
        process.exit(1);
    }
    console.log('SENTRY_REDACTION_TESTS_OK');
}

main();
