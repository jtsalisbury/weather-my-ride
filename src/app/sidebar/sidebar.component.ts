import { Component,  OnInit, EventEmitter, Output } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() locationsChanged = new EventEmitter<Array<PlaceResult>>();

  ngOnInit(): void {

  }
  constructor() {
  }

  private count = 2;
  public addressEntries = [
    {id: 1, val: {}},
    {id: 2, val: {}}
  ];

  onAddressSelected(result: PlaceResult, id) {
    this.addressEntries[this.addressEntries.findIndex(entry => entry.id == id)].val = result;

    this.updateLocations();
  }

  trackEntries(_, entry) {
    return entry ? entry.id : undefined;
  }

  drop(event: CdkDragDrop<Object>) {
    moveItemInArray(this.addressEntries, event.previousIndex, event.currentIndex);
    
    this.updateLocations();
  }

  updateLocations() {
    let locations = [];
    this.addressEntries.forEach(entry => {
      if (Object.entries(entry.val).length !== 0) {
        locations.push(entry.val);
      }
    });

    if (locations.length !== this.addressEntries.length) {
      return;
    }

    this.locationsChanged.emit(locations);
  }

  removeLocationEntry(id) {
    this.addressEntries.splice(this.addressEntries.findIndex(entry => entry.id == id), 1);

    this.updateLocations();
  }

  addLocationEntry() {
    if (this.addressEntries.length + 1 > 20) {
      return;
    }

    this.count++;
    this.addressEntries.push({id: this.count, val: {}});
  }
}
