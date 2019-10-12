import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Tile } from '@riichi/definitions';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'button[scorer-tile-button]',
  exportAs: 'scorerTileButton',
  templateUrl: './tile-button.component.html',
  styleUrls: ['./tile-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TileButtonComponent implements OnInit {

  constructor() { }

  @Input() tile: Tile;

  ngOnInit() {
  }

}
