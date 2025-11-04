import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DriverCountryService {
  private readonly driverCountryMap: Record<number, string> = {
    1: 'NED',
    4: 'GBR',
    5: 'BRA',
    6: 'FRA',
    10: 'FRA',
    12: 'ITA',
    14: 'ESP',
    16: 'MON',
    18: 'CAN',
    22: 'JPN',
    23: 'THA',
    27: 'GER',
    30: 'NZL',
    31: 'FRA',
    43: 'ARG',
    44: 'GBR',
    55: 'ESP',
    63: 'GBR',
    81: 'AUS',
    87: 'GBR'
  }

  getCountryCode(driverNumber: number): string {
    return this.driverCountryMap[driverNumber] ?? '';
  }
}
