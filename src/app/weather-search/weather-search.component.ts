import { Component, Inject } from '@angular/core';
import { WeatherService } from '../weather.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.css']
})
export class WeatherSearchComponent {

  error: any;
  query:any;
  searchForm: FormGroup;
  weatherData: any;
  forecastData:any;
  private maxDataAge = 60 * 60 * 1000;// Maximum allowed age of weather data in milliseconds (1 hour)
  constructor(private weatherService: WeatherService, @Inject(DOCUMENT) private document: Document) {
    this.searchForm = new FormGroup({
      locationQuery: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9\s]*') ,Validators.minLength(3),Validators.maxLength(15)]) //input filed validation and validation search query from special chracter
  });
  }

  ngOnInit() {
    this.document.body.style.backgroundImage = `url('assets/Images/default-weather.jpg')`;
  }

  search():void {
    if (this.searchForm.valid) {
     const query=  this.searchForm.value['locationQuery']
    
    this.weatherService.getWeatherData(query).subscribe(
      data => {

          const timestamp = data.dt * 1000; // Convert timestamp to milliseconds
          const currentTime = Date.now();
          const dataAge = currentTime - timestamp;
          // data up to date validation
        if (dataAge <= this.maxDataAge) {
          this.weatherData = data;
          this.setBackgroundImage(data.weather[0].main)
          this.error = null;
        } else {
          this.error = 'Weather data is not up to date'
        }

      },
      error => {
        this.weatherData = null;
        this.forecastData=null;
        this.error = error.error.message
      }) 


      
    this.weatherService.getForecastData(query).subscribe(
      data => {
       const uniqueDates: any[] = [];

       data.list.forEach((forecast: any) => {
        const date = forecast.dt_txt.split(' ')[0]

        const existingDate = uniqueDates.find((d: any) => d.date === date);

        if (!existingDate) {
          uniqueDates.push({
            date: date,
            highTemp: forecast.main.temp_max,
            lowTemp: forecast.main.temp_min,
            weatherConditions: forecast.weather[0].description,
            icon:forecast.weather[0].icon,
            precipitation: forecast.pop
          });
        }
      },
      this.forecastData= uniqueDates
      )}
      )
    }
  }

  // for background image according to climate
  setBackgroundImage(weather:any):void {
  if (weather == "Rain") {
    this.document.body.style.backgroundImage = `url('assets/Images/rainy-weather.jpg')`;
  } else if (weather == "Snow") {
    this.document.body.style.backgroundImage = `url(''assets/Images/snowy-weather.jpg'')`;
  } else if (weather == "Clear") {
    this.document.body.style.backgroundImage = `url('assets/Images/sunny-weather.jpg')`;
  } else if (weather == "Clouds") {
    this.document.body.style.backgroundImage = `url('assets/Images/cloudy-weather.jpg')`;
  }else if (weather == "Haze") {
    this.document.body.style.backgroundImage = `url('assets/Images/haze-weather.jpg')`;
  }else if (weather == "Dust") {
    this.document.body.style.backgroundImage = `url('assets/Images/dust-weather.jpg')`;
  }
  }

}
