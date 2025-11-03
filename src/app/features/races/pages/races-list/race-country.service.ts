import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RaceCountryService {
  private readonly raceCountryMap: Record<number, string> = {
    1: 'ESP',
    2: 'GBR',
    4: 'JPN',
    5: 'AUS',
    8: 'MEX',
    10: 'BRA',
    133: 'NED',
    13: 'ITA',
    14: 'HUN',
    16: 'BEL',
    17: 'AUT',
    19: 'USA',
    21: 'UAE',
    30: 'AZE',
    46: 'CAN',
    36: 'BRN',
    53: 'CHN',
    114: 'MON',
    149: 'QAT',
    153: 'KSA',
    157: 'SGP'
  }

  getCountryCode(countryKey: number): string {
    return this.raceCountryMap[countryKey] ?? '';
  }
}
