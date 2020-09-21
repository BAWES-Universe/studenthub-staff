import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize'
})
export class FileSizePipe implements PipeTransform {
  transform(size: number) {

    if(size > 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }

    if(size > 1023) { 
        return (size / 1024).toFixed(2) + ' KB';
    }

    return size + ' Byte';
  }
}