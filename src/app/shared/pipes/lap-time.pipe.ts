import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lapTime',
  standalone: true,
})
export class LapTimePipe implements PipeTransform {

  transform(value: number | null): string {
    if (value === 0) return 'DNF';
    if (!value || value < 0 || isNaN(value)) return '-';
    const minutes = Math.floor(value / 60000);
    const seconds = Math.floor((value % 60000) / 1000);
    const millis = value % 1000;
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  }

}
