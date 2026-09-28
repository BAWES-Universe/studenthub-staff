import * as fs from 'fs';
import * as path from 'path';
import { uploadTemporaryFile, TEMP_UPLOAD_HOST } from '../src/app/providers/temp-upload-session';
import {
    BACKEND_IMAGE_EXTENSIONS,
    BACKEND_UPLOAD_EXTENSIONS,
    EXCEL_EXTENSIONS,
    JPEG_PNG_EXTENSIONS,
    PDF_WORD_EXTENSIONS,
    acceptAttribute
} from '../src/app/providers/upload-formats';

const TOKEN = 'synthetic-staff-bearer';
const PRESIGN_URL = 'https://staff.api.example.test/v1/temp-upload/url';
const SIGNED_URL = 'https://' + TEMP_UPLOAD_HOST + '/photo-1.jpg?X-Amz-Signature=synthetic-signature&X-Amz-Credential=AKIATEMPUPLOADTEST01%2F20260101%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Expires=600';

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

function harness(name: string, type: string, allowedExtensions: string[]) {
    const calls: any[] = [];
    const xhrs: Array<{ url: string; headers: Record<string, string> }> = [];
    const options = {
        file: { name, type, size: 128 } as any,
        maxBytes: 5242880,
        oversizedMessage: 'File size should not exceed 5MB!',
        presignUrl: PRESIGN_URL,
        token: TOKEN,
        uploadHost: TEMP_UPLOAD_HOST,
        allowedExtensions,
        post: (url: string, body: any, headers: Record<string, string>) => {
            calls.push({ url, body, headers });
            return {
                subscribe: (next: (body: any) => void) => {
                    next({
                        method: 'PUT',
                        upload_url: SIGNED_URL,
                        key: 'photo-1.jpg',
                        bucket: 'studenthub-public-anyone-can-upload-24hr-expiry',
                        public_url: 'https://' + TEMP_UPLOAD_HOST + '/photo-1.jpg',
                        headers: {
                            'Content-Type': 'image/jpeg',
                            'x-amz-acl': 'public-read'
                        },
                        expires_in: 600
                    });
                    return { unsubscribe() {} };
                }
            };
        },
        createRequest: () => {
            const xhr = {
                url: '',
                headers: {} as Record<string, string>,
                upload: { onprogress: null as any },
                open(method: string, url: string) {
                    xhr.url = url;
                },
                setRequestHeader(header: string, value: string) {
                    xhr.headers[header] = value;
                },
                send() {},
                abort() {}
            };
            xhrs.push(xhr);
            return xhr as unknown as XMLHttpRequest;
        }
    };
    return { calls, xhrs, options };
}

function expectRejected(name: string, type: string, allowed: string[], mustMention: string[]) {
    const session = harness(name, type, allowed);
    let error: Error | null = null;
    const events: any[] = [];
    uploadTemporaryFile(session.options).subscribe(
        (event) => events.push(event),
        (err) => { error = err; }
    );
    assert(session.calls.length === 0, name + ' requested a presign');
    assert(session.xhrs.length === 0, name + ' opened a PUT');
    assert(events.length === 0, name + ' emitted an event');
    assert(error !== null, name + ' did not fail');
    assert(error.message.indexOf('This file type is not supported.') === 0, name + ' message was ' + (error && error.message));
    assert(error.message.indexOf('Temporary upload is unavailable.') === -1, name + ' showed upload unavailable');
    mustMention.forEach((extension) => {
        assert(error.message.indexOf('.' + extension) !== -1, name + ' message omitted .' + extension);
    });
}

function expectAccepted(name: string, type: string, allowed: string[]) {
    const session = harness(name, type, allowed);
    let error: Error | null = null;
    uploadTemporaryFile(session.options).subscribe(() => undefined, (err) => { error = err; });
    assert(error === null, name + ' was rejected: ' + (error && error.message));
    assert(session.calls.length === 1, name + ' did not request a presign');
    assert(session.xhrs.length === 1, name + ' did not open the PUT');
    assert(session.xhrs[0].url === SIGNED_URL, name + ' changed the URL sent to S3');
}

check('inherited property names are not accepted extensions', () => {
    ['example.constructor', 'example.__proto__'].forEach((name) => {
        expectRejected(name, '', BACKEND_IMAGE_EXTENSIONS, BACKEND_IMAGE_EXTENSIONS);
        expectRejected(name, 'application/octet-stream', BACKEND_UPLOAD_EXTENSIONS, BACKEND_UPLOAD_EXTENSIONS);
    });
});

check('image picker rejects SVG, AVIF, JFIF, and ICO before presign', () => {
    ['logo.svg', 'photo.avif', 'scan.jfif', 'icon.ico'].forEach((name) => {
        expectRejected(name, 'image/' + name.split('.').pop(), BACKEND_IMAGE_EXTENSIONS, BACKEND_IMAGE_EXTENSIONS);
    });
});

check('candidate CV picker rejects unsupported files before presign', () => {
    ['notes.txt', 'archive.zip', 'page.html', 'logo.svg', 'photo.avif', 'scan.jfif', 'icon.ico'].forEach((name) => {
        expectRejected(name, 'application/octet-stream', BACKEND_UPLOAD_EXTENSIONS, BACKEND_UPLOAD_EXTENSIONS);
    });
});

check('uppercase supported extensions are accepted', () => {
    expectAccepted('PHOTO.JPEG', '', BACKEND_IMAGE_EXTENSIONS);
    expectAccepted('PHOTO.PNG', 'IMAGE/PNG', BACKEND_IMAGE_EXTENSIONS);
    expectAccepted('RESUME.PDF', '', BACKEND_UPLOAD_EXTENSIONS);
    expectAccepted('SHEET.XLSX', 'application/octet-stream', EXCEL_EXTENSIONS);
});

check('empty and octet-stream MIME types are accepted for a supported extension', () => {
    expectAccepted('photo.jpg', '', JPEG_PNG_EXTENSIONS);
    expectAccepted('photo.jpeg', 'application/octet-stream', JPEG_PNG_EXTENSIONS);
    expectAccepted('resume.docx', '', PDF_WORD_EXTENSIONS);
    expectAccepted('resume.docx', 'application/octet-stream', PDF_WORD_EXTENSIONS);
    expectAccepted('logo.heic', '', BACKEND_IMAGE_EXTENSIONS);
    expectAccepted('logo.HEIF', 'application/octet-stream', BACKEND_UPLOAD_EXTENSIONS);
});

check('narrower pickers stay narrower than the backend image and CV lists', () => {
    expectRejected('anim.gif', 'image/gif', JPEG_PNG_EXTENSIONS, JPEG_PNG_EXTENSIONS);
    expectRejected('notes.pdf', 'application/pdf', JPEG_PNG_EXTENSIONS, JPEG_PNG_EXTENSIONS);
    expectAccepted('anim.gif', '', BACKEND_IMAGE_EXTENSIONS);
    expectRejected('sheet.xlsx', '', PDF_WORD_EXTENSIONS, PDF_WORD_EXTENSIONS);
    expectRejected('photo.png', 'image/png', EXCEL_EXTENSIONS, EXCEL_EXTENSIONS);
    expectAccepted('rates.xls', 'application/octet-stream', EXCEL_EXTENSIONS);
});

check('picker attributes match the owner-approved lists', () => {
    const root = process.env.STAFF_ROOT || '';
    assert(root !== '', 'STAFF_ROOT was not set');
    const imageHtml = fs.readFileSync(path.join(root, 'src/app/components/image-upload/image-upload.component.html'), 'utf8');
    const imageTs = fs.readFileSync(path.join(root, 'src/app/components/image-upload/image-upload.component.ts'), 'utf8');
    const cvHtml = fs.readFileSync(path.join(root, 'src/app/pages/logged-in/candidate/upload-cv/upload-cv.page.html'), 'utf8');
    const cvTs = fs.readFileSync(path.join(root, 'src/app/pages/logged-in/candidate/upload-cv/upload-cv.page.ts'), 'utf8');
    assert(imageHtml.indexOf('image/*') === -1, 'image/* remains');
    assert(imageHtml.indexOf('[accept]="acceptedFormats"') !== -1, 'image picker accept was not bound');
    assert(imageTs.indexOf('BACKEND_IMAGE_EXTENSIONS') !== -1, 'image upload does not use the backend image list');
    assert(cvHtml.indexOf('[accept]="acceptedFormats"') !== -1, 'CV picker accept was not bound');
    assert(cvTs.indexOf('BACKEND_UPLOAD_EXTENSIONS') !== -1, 'CV upload does not use the backend allowlist');
    assert(acceptAttribute(BACKEND_IMAGE_EXTENSIONS) === '.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.bmp,.tif,.tiff', 'image accept string drifted');
    assert(acceptAttribute(BACKEND_UPLOAD_EXTENSIONS) === '.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.bmp,.tif,.tiff,.pdf,.doc,.docx,.xls,.xlsx', 'CV accept string drifted');

    const unchanged = {
        'src/app/pages/logged-in/update-account/update-account.page.html': 'accept=".jpg,.jpeg,.png"',
        'src/app/pages/logged-in/support/ticket-view/ticket-view.page.html': 'accept=".jpg,.jpeg,.png"',
        'src/app/pages/logged-in/support/ticket-form/ticket-form.page.html': 'accept=".jpg,.jpeg,.png"',
        'src/app/pages/logged-in/company/upload-file/upload-file.page.html': 'accept=".jpg,.jpeg,.png"',
        'src/app/pages/logged-in/company/brand-form/brand-form.page.html': 'accept=".jpg,.jpeg,.png"',
        'src/app/pages/logged-in/leave/leave-request-form/leave-request-form.page.html': 'accept=".pdf,.doc,.docx"',
        'src/app/pages/logged-in/fulltimer/fulltimer-form/fulltimer-form.page.html': 'accept=".pdf,.doc,.docx"',
        'src/app/pages/logged-in/expense/expense-form/expense-form.page.html': 'accept=".pdf,.doc,.docx"',
        'src/app/pages/logged-in/transfer/transfer-form/transfer-form.page.html': 'accept=".xlsx,.xls"',
        'src/app/pages/logged-in/transfer/transfer-rates/transfer-rates.page.html': 'accept=".xlsx,.xls"',
        'src/app/pages/logged-in/transfer/import-transfer-form/import-transfer-form.page.html': 'accept=".xlsx,.xls"'
    };
    Object.keys(unchanged).forEach((relative) => {
        const html = fs.readFileSync(path.join(root, relative), 'utf8');
        assert(html.indexOf(unchanged[relative]) !== -1, relative + ' accept changed');
    });
});

if (failures > 0) {
    console.error('FORMAT_TEST_FAILURES ' + failures);
    process.exit(1);
}

console.log('FORMAT_TESTS_OK');
