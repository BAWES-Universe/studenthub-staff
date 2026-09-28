import { Observable, Observer } from 'rxjs';
import { fileExtension, unsupportedFormatMessage } from './upload-formats';

export const TEMP_UPLOAD_HOST = 'studenthub-public-anyone-can-upload-24hr-expiry.s3.eu-west-2.amazonaws.com';

const UNAVAILABLE = 'Temporary upload is unavailable.';
const FAILED = 'Temporary upload failed.';

export interface TempUploadSubscription {
    unsubscribe(): void;
}

export interface TempUploadPost {
    subscribe(
        next: (body: any) => void,
        error: (err: any) => void
    ): TempUploadSubscription;
}

export interface UploadFileLike {
    name?: string;
    type?: string;
    size: number;
}

export interface TempUploadOptions {
    file: UploadFileLike | null;
    maxBytes: number;
    oversizedMessage: string;
    presignUrl: string;
    token: string;
    uploadHost: string;
    allowedExtensions?: string[];
    post: (url: string, body: Record<string, unknown>, headers: Record<string, string>) => TempUploadPost;
    createRequest?: () => XMLHttpRequest;
}

/**
 * Staff temporary upload.
 *
 * The first event is an abort handle with no progress type and no Key, so
 * existing pages that assign currentTarget in that branch can call abort().
 * Key and Location are emitted only after the PUT returns success.
 * Errors are fixed sentences and never include the token or the signed URL.
 */
export function uploadTemporaryFile(options: TempUploadOptions): Observable<any> {
    return new Observable((observer: Observer<any>) => {
        const file = options.file;
        if (!file) {
            observer.error(new Error('File is required'));
            return;
        }

        if (file.size > options.maxBytes) {
            observer.error(new Error(options.oversizedMessage));
            return;
        }

        if (options.allowedExtensions) {
            const extension = fileExtension(file.name || '');
            const accepted = options.allowedExtensions.some((item) => String(item).toLowerCase() === extension);
            if (!accepted) {
                observer.error(new Error(unsupportedFormatMessage(options.allowedExtensions)));
                return;
            }
        }

        if (!options.token) {
            observer.error(new Error(UNAVAILABLE));
            return;
        }

        let xhr: XMLHttpRequest | null = null;
        let subscription: TempUploadSubscription | null = null;
        let cancelled = false;
        let settled = false;

        const fail = (message: string) => {
            if (cancelled || settled) {
                return;
            }
            settled = true;
            observer.error(new Error(message));
        };

        const handle = {
            abort: () => {
                cancelled = true;
                if (subscription) {
                    subscription.unsubscribe();
                }
                if (xhr) {
                    xhr.abort();
                }
            }
        };

        observer.next(handle);

        subscription = options.post(options.presignUrl, {
            filename: file.name || 'file',
            content_type: file.type || '',
            file_size: file.size
        }, {
            Authorization: 'Bearer ' + options.token,
            Accept: 'application/json'
        }).subscribe((body) => {
            if (cancelled || settled) {
                return;
            }

            if (!isPresignedPut(body, options.uploadHost)) {
                fail(UNAVAILABLE);
                return;
            }

            const createRequest = options.createRequest || (() => new XMLHttpRequest());
            xhr = createRequest();
            xhr.open('PUT', body.upload_url);
            xhr.setRequestHeader('Content-Type', body.headers['Content-Type']);
            xhr.setRequestHeader('x-amz-acl', body.headers['x-amz-acl']);
            xhr.upload.onprogress = (event: ProgressEvent) => {
                if (cancelled || settled || !event.lengthComputable) {
                    return;
                }
                observer.next({
                    type: 'progress',
                    loaded: event.loaded,
                    total: event.total
                });
            };
            xhr.onload = () => {
                if (cancelled || settled || !xhr) {
                    return;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    settled = true;
                    observer.next({
                        Key: body.key,
                        Location: body.public_url,
                        Bucket: body.bucket
                    });
                    observer.complete();
                    return;
                }
                fail(FAILED);
            };
            xhr.onerror = () => fail(FAILED);
            xhr.onabort = () => {
                if (!cancelled && !settled) {
                    fail('aborted');
                }
            };
            xhr.send(file as any);
        }, () => fail(UNAVAILABLE));

        return () => handle.abort();
    });
}

export function isPresignedPut(body: any, uploadHost: string): boolean {
    if (!body || body.method !== 'PUT' || typeof body.key !== 'string' || body.key === '') {
        return false;
    }
    if (typeof body.public_url !== 'string' || body.public_url.indexOf('https://') !== 0) {
        return false;
    }
    if (!body.headers || !body.headers['Content-Type'] || !body.headers['x-amz-acl']) {
        return false;
    }
    if (typeof body.upload_url !== 'string') {
        return false;
    }

    let uploadUrl: URL;
    try {
        uploadUrl = new URL(body.upload_url);
    } catch (err) {
        return false;
    }

    return uploadUrl.protocol === 'https:' && uploadUrl.hostname === uploadHost;
}
