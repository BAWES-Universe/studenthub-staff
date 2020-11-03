import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let FileSizePipe = class FileSizePipe {
    transform(size) {
        if (size > 1024 * 1024) {
            return (size / (1024 * 1024)).toFixed(2) + ' MB';
        }
        if (size > 1023) {
            return (size / 1024).toFixed(2) + ' KB';
        }
        return size + ' Byte';
    }
};
FileSizePipe = __decorate([
    Pipe({
        name: 'filesize'
    })
], FileSizePipe);
export { FileSizePipe };
//# sourceMappingURL=filesize.pipe.js.map