import { Component,  OnInit, EventEmitter, Output } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { WeatherService } from '../weather.service';
import { LocationsService } from '../locations.service';

import { Subscription }   from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  weatherSubscription: Subscription;
  locationSubscription: Subscription;

  locationService: LocationsService;

  ngOnInit(): void {

  }

  // Wait for weather data to be received
  constructor(private weatherService: WeatherService, locationService: LocationsService) {
    this.locationService = locationService;
    
    this.weatherSubscription = weatherService.weatherReceived$.subscribe(
      weatherData => {
        console.log(weatherData);
      }
    )

    // Listen for changes to how many address sources we have
    this.locationSubscription = locationService.locationsChanged$.subscribe(
      locations => {
        this.addressEntries = locations;
      }
    )

    this.addressEntries = this.locationService.getSources();
  }

  // Must always have two (origin & destination) but all others are stored here too
  public addressEntries = [];

  trackEntries(_, entry) {
    return entry ? entry.id : undefined;
  }

  // The drop event for drag & drop
  drop(event: CdkDragDrop<Object>) {
    this.locationService.changeLocationPosition(event.previousIndex, event.currentIndex);
  }

  // Add a location to the location service
  addLocationEntry() {
    this.locationService.addLocationSource();
  }

  // Remove a location from the location service
  removeLocationEntry(id) {
    this.locationService.removeLocationSource(id);
  }

}
