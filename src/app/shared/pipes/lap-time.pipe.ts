import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lapTime'
})
export class LapTimePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
