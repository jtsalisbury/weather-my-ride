/// <reference types="@types/googlemaps" />

import { Component, EventEmitter, OnInit, ViewEncapsulation, Output } from '@angular/core';
import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AddressComponent implements OnInit {
  
  constructor(

  ) {}
  
  ngOnInit() {

  }

  @Output() addressSelected = new EventEmitter<PlaceResult>();

  onAutocompleteSelected(result: PlaceResult) {
    this.addressSelected.emit(result);
  }
}