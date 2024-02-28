import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DOCUMENT } from '@angular/common';
import { of, throwError } from 'rxjs';

import { WeatherSearchComponent } from './weather-search.component';
import { WeatherService } from '../weather.service';

fdescribe('WeatherSearchComponent', () => {
  let component: WeatherSearchComponent;
  let fixture: ComponentFixture<WeatherSearchComponent>;
  let weatherService: WeatherService;
  let mockDocument: any;

  beforeEach( async() => {
      mockDocument = {
        querySelectorAll: () => [],
        body: {
          appendChild: jasmine.createSpy('appendChild'),
          style: {
            backgroundImage: '',
          },
        },
      };
      TestBed.configureTestingModule({
        declarations: [WeatherSearchComponent],
        imports: [ReactiveFormsModule, HttpClientTestingModule],
        providers: [
          WeatherService,
          { provide: DOCUMENT, useValue: mockDocument }
        ]
      }).compileComponents();
    }
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherSearchComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    it('should call weatherService.getWeatherData and set weatherData and backgroundImage on success', () => {
      const query = 'London';
      const weatherData = {
        dt: Date.now() / 1000, // current timestamp
        weather: [{ main: 'Rain' }]
      };

      spyOn(weatherService, 'getWeatherData').and.returnValue(of(weatherData));
      spyOn(component, 'setBackgroundImage');

      component.searchForm.setValue({ locationQuery: query });
      component.search();

      expect(weatherService.getWeatherData).toHaveBeenCalledWith(query);
      expect(component.weatherData).toEqual(weatherData);
      expect(component.setBackgroundImage).toHaveBeenCalledWith('Rain');
      expect(component.error).toBeNull();
    });

    it('should set error message on weatherService.getWeatherData error', () => {
      const query = 'InvalidLocation';
      const errorMessage = 'Failed to fetch weather data.';

      spyOn(weatherService, 'getWeatherData').and.returnValue(
        throwError(errorMessage)
      );

      component.searchForm.setValue({ locationQuery: query });
      component.search();

      expect(weatherService.getWeatherData).toHaveBeenCalledWith(query);
      expect(component.weatherData).toBeNull();
      expect(component.error).toEqual(errorMessage);
    });

    it('should set error message if weather data is not up to date', () => {
      const query = 'London';
      const weatherData = {
        dt: Date.now() / 1000 - 2 * 60 * 60, // 2 hours old timestamp
        weather: [{ main: 'Rain' }]
      };

      spyOn(weatherService, 'getWeatherData').and.returnValue(of(weatherData));

      component.searchForm.setValue({ locationQuery: query });
      component.search();

      expect(weatherService.getWeatherData).toHaveBeenCalledWith(query);
      expect(component.weatherData).toBeNull();
      expect(component.error).toEqual('Weather data is not up to date');
    });
  });
});
