import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/';
  private apiKey = '886705b4c1182eb1c69f28eb8c520e20';
  
  constructor(private http: HttpClient) {}

  //creating service for wheather data
  getWeatherData(location: string): Observable<any> {
    const url =  `${this.apiUrl}weather?q=${location},IN&appid=${this.apiKey}`
    return this.http.get<any>(url);
  }
//creating service for forecaste data
  getForecastData(location: string): Observable<any> {
    const url = `${this.apiUrl}/forecast?q=${location},IN&appid=${this.apiKey}`;
    return this.http.get<any>(url);
  }
  
}
