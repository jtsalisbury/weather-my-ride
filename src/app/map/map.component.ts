import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() locations: Array<PlaceResult>;

  latitude = 37.77;
  longitude = -122.447;
  mapType = 'roadmap';

  constructor() { }

  ngOnInit() {
    this.setCurrentPosition();
  }

  public origin: any;
  public destination: any;
  public waypoints: Array<Object>;

  ngOnChanges(changes: SimpleChanges) {
    let locs = changes.locations.currentValue;
    let len = Object.keys(locs).length;

    if (len == 0) {
      this.origin = null;
      this.destination = null;
      this.waypoints = [];
      
      return;
    }
  
    this.origin = { 
      lat: locs[0].geometry.location.lat(),
      lng: locs[0].geometry.location.lng()
    }
    this.destination = { 
      lat: locs[len - 1].geometry.location.lat(),
      lng: locs[len - 1].geometry.location.lng()
    }

    this.waypoints = [];
    if (len > 2) {
      let arr = [];

      for (let i = 1; i <= len - 2; i++) {
        arr.push(
          { 
            location: {
              lat: locs[i].geometry.location.lat(),
              lng: locs[i].geometry.location.lng()
            }
          }
        );
      }

      this.waypoints = arr;
    }
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }
}