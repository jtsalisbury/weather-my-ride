import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  latitude = 37.77;
  longitude = -122.447;
  mapType = 'roadmap';

  constructor() { }

  ngOnInit(): void {

  }

}