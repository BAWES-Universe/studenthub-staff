import { TEMP_UPLOAD_HOST } from './temp-upload-session';

const SENSITIVE_QUERY_KEYS = ['x-amz-signature', 'x-amz-credential', 'x-amz-security-token'];
const EMBEDDED_URL = new RegExp(
    'https?:\\/\\/[^\\s\'"<>]*' + TEMP_UPLOAD_HOST.replace(/\./g, '\\.') + '[^\\s\'"<>]*',
    'gi'
);

/**
 * Remove presigned credential material from a telemetry string.
 * The returned value is for Sentry only. Callers must keep using the original upload URL.
 */
export function redactPresignedUploadUrl(url: string): string {
    if (typeof url !== 'string' || url.indexOf(TEMP_UPLOAD_HOST) === -1) {
        return url;
    }

    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch (err) {
        return url;
    }

    if (parsed.hostname !== TEMP_UPLOAD_HOST) {
        return url;
    }

    const sensitiveKeys = Array.from(parsed.searchParams.keys()).filter((key) => {
        return SENSITIVE_QUERY_KEYS.indexOf(key.toLowerCase()) !== -1;
    });
    if (sensitiveKeys.length === 0) {
        return url;
    }

    sensitiveKeys.forEach((key) => {
        parsed.searchParams.set(key, '[redacted]');
    });

    return parsed.toString();
}

function redactEmbeddedText(value: string): { value: string; changed: boolean; unsafe: boolean } {
    if (value.indexOf(TEMP_UPLOAD_HOST) === -1) {
        return { value, changed: false, unsafe: false };
    }

    let changed = false;
    let unsafe = false;
    const next = value.replace(EMBEDDED_URL, (match) => {
        const redacted = redactPresignedUploadUrl(match);
        if (redacted === match) {
            unsafe = true;
            return match;
        }
        changed = true;
        return redacted;
    });

    if (!unsafe && next.indexOf(TEMP_UPLOAD_HOST) !== -1 && stillHasSignedMaterial(next)) {
        unsafe = true;
    }

    return { value: next, changed, unsafe };
}

function stillHasSignedMaterial(value: string): boolean {
    const lower = value.toLowerCase();
    return SENSITIVE_QUERY_KEYS.some((key) => {
        const marker = key + '=';
        const at = lower.indexOf(marker);
        if (at === -1) {
            return false;
        }
        const rest = lower.slice(at + marker.length);
        return rest.indexOf('[redacted]') !== 0 && rest.indexOf('%5bredacted%5d') !== 0;
    });
}

function isPlainObject(value): boolean {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

function containsUploadHost(value, seen): boolean | 'unknown' {
    if (typeof value === 'string') {
        return value.indexOf(TEMP_UPLOAD_HOST) !== -1;
    }
    if (value == null || typeof value === 'number' || typeof value === 'boolean') {
        return false;
    }
    if (typeof value !== 'object') {
        return false;
    }
    if (seen.has(value)) {
        return false;
    }
    seen.add(value);

    if (typeof URL !== 'undefined' && value instanceof URL) {
        return value.href.indexOf(TEMP_UPLOAD_HOST) !== -1;
    }

    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            const found = containsUploadHost(value[i], seen);
            if (found === true || found === 'unknown') {
                return found;
            }
        }
        return false;
    }

    const readableFields = ['message', 'stack', 'url', 'href', 'name'];
    for (let i = 0; i < readableFields.length; i++) {
        try {
            const field = value[readableFields[i]];
            if (typeof field === 'string' && field.indexOf(TEMP_UPLOAD_HOST) !== -1) {
                return true;
            }
        } catch (err) {
            return 'unknown';
        }
    }

    let keys: string[];
    try {
        keys = Object.keys(value);
    } catch (err) {
        return 'unknown';
    }

    for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(TEMP_UPLOAD_HOST) !== -1) {
            return true;
        }
        try {
            const found = containsUploadHost(value[keys[i]], seen);
            if (found === true || found === 'unknown') {
                return found;
            }
        } catch (err) {
            return 'unknown';
        }
    }

    return false;
}

function redactValue(value, seen): { value: any; changed: boolean; unsafe: boolean } {
    if (typeof value === 'string') {
        return redactEmbeddedText(value);
    }
    if (value == null || typeof value === 'number' || typeof value === 'boolean') {
        return { value, changed: false, unsafe: false };
    }
    if (typeof value !== 'object') {
        return { value, changed: false, unsafe: false };
    }
    if (seen.has(value)) {
        return { value, changed: false, unsafe: true };
    }

    if (!Array.isArray(value) && !isPlainObject(value)) {
        const found = containsUploadHost(value, new Set());
        return { value, changed: false, unsafe: found === true || found === 'unknown' };
    }

    seen.add(value);

    if (Array.isArray(value)) {
        const copy = [];
        let changed = false;
        for (let i = 0; i < value.length; i++) {
            const result = redactValue(value[i], seen);
            if (result.unsafe) {
                return { value, changed: false, unsafe: true };
            }
            copy.push(result.value);
            if (result.changed) {
                changed = true;
            }
        }
        return { value: changed ? copy : value, changed, unsafe: false };
    }

    const copy = {};
    let changed = false;
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++) {
        const keyResult = redactEmbeddedText(keys[i]);
        if (keyResult.unsafe) {
            return { value, changed: false, unsafe: true };
        }
        const result = redactValue(value[keys[i]], seen);
        if (result.unsafe) {
            return { value, changed: false, unsafe: true };
        }
        copy[keyResult.value] = result.value;
        if (keyResult.changed || result.changed) {
            changed = true;
        }
    }

    return { value: changed ? copy : value, changed, unsafe: false };
}

/**
 * Breadcrumbs integration stores the XHR URL, and console breadcrumbs store
 * the formatted message plus the original arguments. TryCatch({ XMLHttpRequest: false })
 * does not stop that. Redact presigned upload query values and keep method/status.
 * Returns null when a signed URL is present but cannot be removed safely.
 */
export function redactPresignedUploadBreadcrumb(breadcrumb) {
    if (!breadcrumb) {
        return breadcrumb;
    }

    let message = breadcrumb.message;
    let changed = false;

    if (typeof message === 'string') {
        const redactedMessage = redactEmbeddedText(message);
        if (redactedMessage.unsafe) {
            return null;
        }
        if (redactedMessage.changed) {
            message = redactedMessage.value;
            changed = true;
        }
    }

    let data = breadcrumb.data;
    if (data && typeof data === 'object') {
        const redactedData = redactValue(data, new Set());
        if (redactedData.unsafe) {
            return null;
        }
        if (redactedData.changed) {
            data = redactedData.value;
            changed = true;
        }
    }

    if (!changed) {
        return breadcrumb;
    }

    return {
        ...breadcrumb,
        message,
        data
    };
}
