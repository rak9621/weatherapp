import { TemperaturePipe } from './temperature.pipe';

describe('TemperaturePipe', () => {
  let pipe: TemperaturePipe;

  beforeEach(() => {
    pipe = new TemperaturePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert temperature to Celsius', () => {
    const value = 300; // 300K = 26.85°C

    const result = pipe.transform(value, 'C');

    expect(result).toBe('27°C');
  });

  it('should convert temperature to Fahrenheit', () => {
    const value = 300; // 300K = 80.33°F

    const result = pipe.transform(value, 'F');

    expect(result).toBe('80°F');
  });

  it('should convert temperature to Kelvin', () => {
    const value = 300;

    const result = pipe.transform(value, 'K');

    expect(result).toBe('300K');
  });

  it('should convert temperature to Celsius by default', () => {
    const value = 300; // 300K = 26.85°C

    const result = pipe.transform(value);

    expect(result).toBe('27°C');
  });
});
