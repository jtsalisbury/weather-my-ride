import { Component, OnInit, Input, NgZone } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import { WeatherService } from '../weather.service';
import { Subscription } from 'rxjs';
import { LocationsService } from '../locations.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() locations: Array<PlaceResult>;
  weatherSubscription: Subscription;
  waypointSubscription: Subscription;
  transportationMethodSubscription: Subscription;

  latitude = 37.77;
  longitude = -122.447;
  mapType = 'roadmap';

  constructor(private weatherService: WeatherService, private locationService: LocationsService, private ngZone: NgZone) {  
    // Listen for weather data to add markers
    this.weatherSubscription = weatherService.weatherReceived$.subscribe(
      weatherData => {
        this.setMarkers(weatherData);
        this.setWeatherLoading(false);
      }
    )

    // Listen for location changes to update our waypoints/origin/destination
    this.waypointSubscription = locationService.waypointsChanged$.subscribe(
      waypoints => {
        this.setWeatherLoading(true);
        this.updateLocations(waypoints);
      }
    )

    this.transportationMethodSubscription = locationService.transportationMethodChanged$.subscribe(
      method => {
        this.setTransportationMethod(method);
      }
    )
  }

  ngOnInit() {
    this.setCurrentPosition();
  }

  // Once the directions have been received, have our weatherservice update
  onResponse(event) {
    this.weatherService.setDirections(event)
  }

  // Hide default markers
  public renderOptions = {
    suppressMarkers: true
  }

  public travelMode: String = "DRIVING";
  public origin: any;
  public destination: any;
  public waypoints: Array<Object>;
  public markers: Array<Object> = [];
  public isLoading = false;

  setWeatherLoading(newLoadingState) {
    this.ngZone.run(() => {
      this.isLoading = newLoadingState;
    });
  }

  // Dynamically add markers 
  setMarkers(weatherData) {
    this.markers = [];

    let legs = weatherData.routes[0].legs;

    // Legs will have a start and end location. End location may be the start location of a next leg
    // Always add the first entry
    this.markers.push({
      lat: legs[0].start_location.lat(),
      lng: legs[0].start_location.lng()
    });

    for (let i = 0; i < legs.length; i++) {     
      // Make sure we add the end location's weather data for each leg
      this.markers.push({
        lat: legs[i].end_location.lat(),
        lng: legs[i].end_location.lng(),
        icn: {
          url: legs[i].weatherData.currently.iconURL,
          scaledSize: {
            width: 32,
            height: 32
          }
        }
      });
      
    }
  }

  setTransportationMethod(method) {
    this.travelMode = method;
  }

  // Once the locations change
  updateLocations(locs) {
    let len = Object.keys(locs).length;

    // No locations
    if (len == 0) {
      this.origin = null;
      this.destination = null;
      this.waypoints = [];
      
      return;
    }
    
    // Setup the origin and destinations (0th and length -1, respectively)
    this.origin = { 
      lat: locs[0].geometry.location.lat(),
      lng: locs[0].geometry.location.lng()
    }
    this.destination = { 
      lat: locs[len - 1].geometry.location.lat(),
      lng: locs[len - 1].geometry.location.lng()
    }

    // Anything else should be a waypoint in between 
    this.waypoints = [];
    if (len > 2) {
      let arr = [];

      for (let i = 1; i <= len - 2; i++) {
        arr.push({ 
          location: {
            lat: locs[i].geometry.location.lat(),
            lng: locs[i].geometry.location.lng()
          }
        });
      }

      this.waypoints = arr;
    }
  }

  // Setup the current position to be our location
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }
}