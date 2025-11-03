import { TestBed } from '@angular/core/testing';
import { RaceCountryService } from './race-country.service';

describe('RaceCountryService', () => {
  let service: RaceCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaceCountryService]
    });
    service = TestBed.inject(RaceCountryService);
  });

  it('should be created service', () => {
    expect(service).toBeTruthy();
  });

  it('should return country code for key', () => {
    expect(service.getCountryCode(1)).toBe('ESP');
    expect(service.getCountryCode(114)).toBe('MON');
    expect(service.getCountryCode(153)).toBe('KSA');
  });

  it("should return empty string for key don't mapped", () => {
    expect(service.getCountryCode(999)).toBe('');
    expect(service.getCountryCode(0)).toBe('');
    expect(service.getCountryCode(-1)).toBe('');
  });

  it("should have all countries mapped", () => {
    const testCase = [
      { key: 1, expected: 'ESP' },
      { key: 2, expected: 'GBR' },
      { key: 4, expected: 'JPN' },
      { key: 5, expected: 'AUS' },
      { key: 8, expected: 'MEX' },
      { key: 10, expected: 'BRA' },
      { key: 13, expected: 'ITA' },
      { key: 14, expected: 'HUN' },
      { key: 16, expected: 'BEL' },
      { key: 17, expected: 'AUT' },
      { key: 19, expected: 'USA' },
      { key: 21, expected: 'UAE' },
      { key: 30, expected: 'AZE' },
      { key: 46, expected: 'CAN' },
      { key: 36, expected: 'BRN' },
      { key: 53, expected: 'CHN' },
      { key: 114, expected: 'MON' },
      { key: 133, expected: 'NED' },
      { key: 149, expected: 'QAT' },
      { key: 153, expected: 'KSA' },
      { key: 157, expected: 'SGP' }
    ]

    testCase.forEach(({ key, expected }) => {
      expect(service.getCountryCode(key)).toBe(expected);
    })
  });
});
