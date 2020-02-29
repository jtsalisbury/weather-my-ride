import { Component } from '@angular/core';
import { WeatherService } from './weather.service';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WeatherService]
})
export class AppComponent {
  title = 'weather-my-route';

  constructor(private weatherService: WeatherService) {}

  locations = [];
  onLocationsChanged(result: Array<PlaceResult>) {
    result.forEach(location => this.weatherService.getWeather(location));

    this.locations = Object.assign({}, result);
  }
}
