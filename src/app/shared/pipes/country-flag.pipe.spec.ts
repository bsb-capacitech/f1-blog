import { CountryFlagPipe } from './country-flag.pipe';

describe('CountryFlagPipe', () => {
  let pipe: CountryFlagPipe;

  beforeEach(() => {
    pipe = new CountryFlagPipe();
  });

  it('should return the correct flag for known countries', () => {
    expect(pipe.transform('NED')).toBe('🇳🇱');
    expect(pipe.transform('GBR')).toBe('🇬🇧');
    expect(pipe.transform('AUS')).toBe('🇦🇺');
  });

  it('should return 🏁 to unmapped countries', () => {
    expect(pipe.transform('Unkownland')).toBe('🏁');
  });

  it('should handle null or undefined values', () => {
    expect(pipe.transform(null as any)).toBe('🏁');
    expect(pipe.transform(undefined as any)).toBe('🏁');
  });
});
