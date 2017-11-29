import { Pipe, PipeTransform } from '@angular/core';
// import * as moment  from "moment";

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if(!value) return value;
    return moment(value).format(args);
  }

}
