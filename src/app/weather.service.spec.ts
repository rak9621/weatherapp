import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve weather data', () => {
    const location = 'London';
    const weatherData = { weather: [{ main: 'Rain' }] };

    (service as any).apiUrl = 'testApiUrl';

    service.getWeatherData(location).subscribe(data => {
      expect(data).toEqual(weatherData);
    });

    const req = httpMock.expectOne(`${(service as any).apiUrl}weather?q=${location},IN&appid=${(service as any).apiKey}`);
    expect(req.request.method).toBe('GET');
    req.flush(weatherData);
  });

  it('should retrieve forecast data', () => {
    const location = 'London';
    const forecastData = {
      list: [
        {
          dt_txt: '2023-06-15 12:00:00',
          main: { temp_max: 20, temp_min: 10 },
          weather: [{ description: 'Rain', icon: '01d' }],
          pop: 0.5
        }
      ]
    };

    (service as any).apiUrl = 'testApiUrl';

    service.getForecastData(location).subscribe(data => {
      expect(data).toEqual(forecastData);
    });

    const req = httpMock.expectOne(`${(service as any).apiUrl}/forecast?q=${location},IN&appid=${(service as any).apiKey}`);
    expect(req.request.method).toBe('GET');
    req.flush(forecastData);
  });
});
