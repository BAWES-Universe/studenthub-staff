import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'store_name'
})
export class GroupByPipe implements PipeTransform {

  transform(value): any {
    const groups = {};

    value.forEach(o => {
      const group = o.store_id;

      groups[group] = groups[group] ?
         groups[group] : { name: o.store_name, resources: [] };
      groups[group].resources.push(o);
    });

    return Object.keys(groups).map(key => groups[key]);
  }
}
