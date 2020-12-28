import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'email'
})
export class EmailPipe implements PipeTransform 
{
    transform(value, args){
        if(value){
            
            let email = value.split('@');  //Split user's name from email -> name = all strings before '@'
            return email[0];    //return user's name
        }
        else{
            return value;
        }
    }
}
