import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature'
})
//for temp measurment validation 
export class TemperaturePipe implements PipeTransform {
  transform(value: number, unit: string = 'C'): string {
    if (unit === 'C') {
      return Math.round(value - 273.15) + '°C';
    } else if (unit === 'F') {
      return Math.round((value - 273.15) * 9 / 5 + 32) + '°F';
    } else {
      return value + 'K';
    }
  }
}
