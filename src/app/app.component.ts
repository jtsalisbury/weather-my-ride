import { Component } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-my-route';

  locations = [];
  onLocationsChanged(result: Array<PlaceResult>) {
    this.locations = Object.assign({}, result);
  }
}
