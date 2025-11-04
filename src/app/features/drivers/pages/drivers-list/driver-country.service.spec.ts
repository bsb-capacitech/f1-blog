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
      { driverNumber: 1, expect: 'NED' },
      { driverNumber: 4, expect: 'GBR' },
      { driverNumber: 5, expect: 'BRA' },
      { driverNumber: 6, expect: 'FRA' },
      { driverNumber: 10, expect: 'FRA' },
      { driverNumber: 12, expect: 'ITA' },
      { driverNumber: 14, expect: 'ESP' },
      { driverNumber: 16, expect: 'MON' },
      { driverNumber: 18, expect: 'CAN' },
      { driverNumber: 22, expect: 'JPN' },
      { driverNumber: 23, expect: 'THA' },
      { driverNumber: 27, expect: 'GER' },
      { driverNumber: 30, expect: 'NZL' },
      { driverNumber: 31, expect: 'FRA' },
      { driverNumber: 43, expect: 'ARG' },
      { driverNumber: 44, expect: 'GBR' },
      { driverNumber: 55, expect: 'ESP' },
      { driverNumber: 63, expect: 'GBR' },
      { driverNumber: 81, expect: 'AUS' },
      { driverNumber: 87, expect: 'GBR' },
    ]

    testCases.forEach(({ driverNumber, expect }) => {
      expect(service.getCountryCode(driverNumber)).toBe(expect);
    });
  });
});
