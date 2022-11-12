import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject }    from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // Setup handlers for components to subscribe for when we get weather data
  private weatherSource = new Subject<Array<Object>>();
  weatherReceived$ = this.weatherSource.asObservable();

  constructor(private http: HttpClient) {} 

  private headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  }

  getWeather(lat, lng, time) {
    let result = this.http.get(`./forecast?details=${lat},${lng},${time}`, this.headerOptions).toPromise();
    return result;
  }

  // Method to handle setting directions
  setDirections(directions) {
    let legs = directions.routes[0].legs;

    // Get the time
    // Convert our time to GMT, then we can add the offset as a total duration
    //   and make a time request with GMT
    let now = Math.floor(Date.now() / 1000); //ms to s
    let totalTime = now;

    // Weather for departure location
    let results = [];
    let result = this.getWeather(legs[0].start_location.lat(), legs[0].start_location.lng(), totalTime);
    result.then(weatherData => {
      // Add the weather data to the directions info
      legs[0].departure_weather = weatherData;

      // Get the URL corresponding to the icon
      let iconURL = this.getIconURL(legs[0].departure_weather.currently.icon);
      legs[0].departure_weather.currently.iconURL = iconURL;
    })
    results.push(result);

    // Grab the weather at the end of each leg
    legs.forEach(async (leg) => {
      totalTime += leg.duration.value;

      let result = this.getWeather(leg.end_location.lat(), leg.end_location.lng(), totalTime);
      result.then(weatherData => {
        // Add the weather data to the directions info
        leg.destination_weather = weatherData;

        // Get the URL corresponding to the icon
        let iconURL = this.getIconURL(leg.destination_weather.currently.icon);
        leg.destination_weather.currently.iconURL = iconURL;
      })

      results.push(result);
    });

    // Once all have resolved, send the info to our subscribers
    Promise.all(results).then(() => {
      this.weatherSource.next(directions);
    });
  }

  getIconURL(icon) {
    return "assets/img/weather/" + icon + ".svg";
  }
}
