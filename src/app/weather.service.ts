import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject }    from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private weatherSource = new Subject<Array<Object>>();

  weatherReceived$ = this.weatherSource.asObservable();

  constructor(private http: HttpClient) {
  } 

  setDirections(directions) {
    let legs = directions.routes[0].legs;

    let now = Math.floor(Date.now() / 1000); //ms to s
    let totalDuration = 0;
    let totalTime = now;
    let oldTimeZone;

    legs.forEach(async leg => {
      totalTime += leg.duration.value;

      // TODO: incorporate timezone conversion with duration
      // Adding the time then converting should work to the target timezone

      let smth = this.http.get(`https://api.darksky.net/forecast/${environment.darkSkyApiKey}/${leg.end_location.lat()},${leg.end_location.lng()},${totalTime}`).toPromise();
      smth.then(res => {
        console.log(res);
      })
      console.log(smth);
    });




    
    // Callback the weather to any handlers
    this.weatherSource.next(directions);
  }

  getWeather(location) {
    console.log(location);
  }
}
