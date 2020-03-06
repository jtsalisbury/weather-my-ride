/// <reference types="@types/googlemaps" />

import { Component, EventEmitter, OnInit, ViewEncapsulation, Output, Input } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import { LocationsService } from '../locations.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AddressComponent implements OnInit {
  @Input() entryid;

  locationService: LocationsService;
  
  constructor(locationService: LocationsService) {
    this.locationService = locationService;
  }
  
  ngOnInit() {

  }

  onAutocompleteSelected(result: PlaceResult) {
    this.locationService.updateLocation(this.entryid, result);
  }
}