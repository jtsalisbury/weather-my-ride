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

  // Method to handle setting directions
  setDirections(directions) {
    let legs = directions.routes[0].legs;

    // Get the time
    // Convert our time to GMT, then we can add the offset as a total duration
    //   and make a time request with GMT
    let now = Math.floor(Date.now() / 1000); //ms to s
    let totalTime = now;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }

    // Grab the weather at the end of each leg
    let results = [];
    legs.forEach(async (leg, i) => {
      totalTime += leg.duration.value;

      // TODO: incorporate timezone conversion with duration
      // Adding the time then converting should work to the target timezone
      let proxy = "https://cors-anywhere.herokuapp.com/";
      let result = this.http.get(proxy + `https://api.darksky.net/forecast/${environment.darkSkyApiKey}/${leg.end_location.lat()},${leg.end_location.lng()},${totalTime}`, options).toPromise();
      result.then(weatherData => {
        // Add the weather data to the directions info
        directions.routes[0].legs[i].weatherData = weatherData;

        // Get the URL corresponding to the icon
        let iconURL = this.getIconURL(directions.routes[0].legs[i].weatherData.currently.icon);
        directions.routes[0].legs[i].weatherData.currently.iconURL = iconURL;
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
