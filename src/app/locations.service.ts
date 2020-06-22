import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { moveItemInArray } from '@angular/cdk/drag-drop';


@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  locations = [
    {id: 1, val: {}},
    {id: 2, val: {}}
  ];
  idCount = 2;

  // Observable for the location entries
  locationSources = new Subject<Array<Object>>();
  locationsChanged$ = this.locationSources.asObservable();

  // Observable for the actual destinations
  waypointSources = new Subject<Array<Object>>();
  waypointsChanged$ = this.waypointSources.asObservable();

  waypointsActual: Array<Object> = [];

  // Observable for the transportation method
  transportationSource = new Subject<String>();
  transportationMethodChanged$ = this.transportationSource.asObservable();

  travelModeActual: String = 'DRIVING';

  constructor() {
  }

  // Used to update the location info for a corresponding entry
  updateLocation(id, data) {
    this.locations[this.locations.findIndex(entry => entry.id == id)].val = data;

    this.publishLocations();
  }

  // Publish the locations
  private publishLocations() {
    let waypoints = [];

    // Put together an array of just location info
    this.locations.forEach(entry => {
      if (Object.entries(entry.val).length !== 0) {
        waypoints.push(entry.val);
      }
    })

    if (this.locations.length !== waypoints.length) {
      return;
    }
    
    this.waypointsActual = waypoints;

    this.waypointSources.next(waypoints);
  }

  // Publish the location sources
  private publishSources() {
    this.locationSources.next(this.locations);
  }

  // Get the source info
  getSources() {
    return this.locations;
  }

  // Add a source to the locations
  addLocationSource() {
    if (this.locations.length + 1 > 20) {
      return;
    }

    // Insert a  new source
    this.idCount++;
    this.locations.push({
      id: this.idCount,
      val: {}
    });
    
    this.publishSources();
  }

  // Remove a location source
  removeLocationSource(id) {
    if (this.locations.length == 2) {
      return;
    }

    // Delete it
    this.locations.splice(this.locations.findIndex(entry => entry.id == id), 1);
    
    // Publish the sources and actual locations
    this.publishSources();
    this.publishLocations();
  }

  // Change a location source's position
  changeLocationPosition(prevIndex, newIndex) {
    moveItemInArray(this.locations, prevIndex, newIndex);

    this.publishLocations();
  }

  setTransportationMethod(method) {
    this.transportationSource.next(method);

    this.travelModeActual = method;
  }

  // Construct a string for the Google Navigation API
  getNavigationString() {
    let baseUrl = 'https://www.google.com/maps/dir/?api=1';

    if (this.waypointsActual.length < 2) {
      return;
    }

    let origin = this.waypointsActual[0]['formatted_address'];
    let destination = this.waypointsActual[this.waypointsActual.length - 1]['formatted_address'];

    origin = encodeURIComponent(origin);
    destination = encodeURIComponent(destination);

    let waypoints = '';
    for (let i = 1; i < this.waypointsActual.length - 1; i++) {
      let waypoint = this.waypointsActual[i];

      waypoints += `|${waypoint['formatted_address']}`;
    }
    waypoints = encodeURIComponent(waypoints.substr(1, waypoints.length));

    return `${baseUrl}&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelMode=${this.travelModeActual}`;
  }
}
