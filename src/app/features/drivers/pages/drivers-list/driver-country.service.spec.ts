import { TestBed } from '@angular/core/testing';

import { DriverCountryService } from './driver-country.service';

describe('DriverCountryService', () => {
  let service: DriverCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DriverCountryService]
    });
    service = TestBed.inject(DriverCountryService);
  });

  it('should service create', () => {
    expect(service).toBeTruthy();
  });

  it('should return code country for driver number exist', () => {
    expect(service.getCountryCode(1)).toBe('NED');
    expect(service.getCountryCode(44)).toBe('GBR');
    expect(service.getCountryCode(16)).toBe('MON');
  });

  it('should return empty string for unmapped driver number', () => {
    expect(service.getCountryCode(999)).toBe('');
    expect(service.getCountryCode(0)).toBe('');
    expect(service.getCountryCode(-1)).toBe('');
  });

  it('should coverage all mapped drivers', () => {
    const testCases = [
      { driverNumber: 1, expected: 'NED' },
      { driverNumber: 4, expected: 'GBR' },
      { driverNumber: 5, expected: 'BRA' },
      { driverNumber: 6, expected: 'FRA' },
      { driverNumber: 10, expected: 'FRA' },
      { driverNumber: 12, expected: 'ITA' },
      { driverNumber: 14, expected: 'ESP' },
      { driverNumber: 16, expected: 'MON' },
      { driverNumber: 18, expected: 'CAN' },
      { driverNumber: 22, expected: 'JPN' },
      { driverNumber: 23, expected: 'THA' },
      { driverNumber: 27, expected: 'GER' },
      { driverNumber: 30, expected: 'NZL' },
      { driverNumber: 31, expected: 'FRA' },
      { driverNumber: 43, expected: 'ARG' },
      { driverNumber: 44, expected: 'GBR' },
      { driverNumber: 55, expected: 'ESP' },
      { driverNumber: 63, expected: 'GBR' },
      { driverNumber: 81, expected: 'AUS' },
      { driverNumber: 87, expected: 'GBR' },
    ]

    testCases.forEach(({ driverNumber, expected }) => {
      expect(service.getCountryCode(driverNumber)).toBe(expected);
    });
  });
});
