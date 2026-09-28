export const JPEG_PNG_EXTENSIONS = ['jpg', 'jpeg', 'png'];
export const PDF_WORD_EXTENSIONS = ['pdf', 'doc', 'docx'];
export const EXCEL_EXTENSIONS = ['xlsx', 'xls'];
export const BACKEND_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'bmp', 'tif', 'tiff'];
export const BACKEND_UPLOAD_EXTENSIONS = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'bmp', 'tif', 'tiff',
    'pdf', 'doc', 'docx', 'xls', 'xlsx'
];

const UNSUPPORTED_PREFIX = 'This file type is not supported.';

export function acceptAttribute(extensions: string[]): string {
    return extensions.map((extension) => '.' + extension).join(',');
}

/**
 * Same rule as the temporary-upload presigner: the text after the last dot,
 * lowercased. A leading dot or a missing dot is not an extension.
 */
export function fileExtension(name: string): string {
    if (!name) {
        return '';
    }
    const basename = name.split(/[\\/]/).pop() || '';
    const pos = basename.lastIndexOf('.');
    if (basename === '' || pos < 1) {
        return '';
    }
    return basename.slice(pos + 1).toLowerCase();
}

export function unsupportedFormatMessage(extensions: string[]): string {
    return UNSUPPORTED_PREFIX + ' Accepted formats: ' + extensions.map((extension) => '.' + extension).join(', ');
}

export function isUnsupportedUploadError(err): boolean {
    return !!(err && typeof err.message === 'string' && err.message.indexOf(UNSUPPORTED_PREFIX) === 0);
}

export function uploadAlertMessage(err, fallback: string): string {
    if (isUnsupportedUploadError(err)) {
        return err.message;
    }
    return fallback;
}
