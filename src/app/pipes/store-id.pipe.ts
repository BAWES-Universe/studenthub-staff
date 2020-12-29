import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'store_id'
})
export class StoreIdPipe implements PipeTransform {
  transform(value) : any {
    var groups = {};

    if(!value)
      value = [];

    value.forEach(function(o) {
      
      var group = o.candidate.store.store_id;   
       
      groups[group] = groups[group] ?
         groups[group] : { name: o.candidate.store.store_name, resources: [] };
      groups[group].resources.push(o);  
    });

    let result = Object.keys(groups).map(function (key) {return groups[key]});

    return result;
  }
}