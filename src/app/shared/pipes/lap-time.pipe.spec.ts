import { LapTimePipe } from './lap-time.pipe';

describe('LapTimePipe', () => {
  let pipe: LapTimePipe;

  beforeEach(() => (pipe = new LapTimePipe));

  it('should convert miliseconds for min:sec.mil format', () => {
    expect(pipe.transform(85264)).toBe('1:25.234');
  });

  it('should return "DNF" for 0 values', () => {
    expect(pipe.transform(0)).toBe('DNF');
  });

  it('should return "-" for null or invalid values', () => {
    expect(pipe.transform(null)).toBe('-');
    expect(pipe.transform(NaN)).toBe('-');
  });

  it('should to lead with big values', () => {
    expect(pipe.transform(3600000)).toBe('60:00.000');
  });
});
