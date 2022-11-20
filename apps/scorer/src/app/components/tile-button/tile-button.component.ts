import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Tile } from '@riichi/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[scorer-tile-button]',
  exportAs: 'scorerTileButton',
  templateUrl: './tile-button.component.html',
  styleUrls: ['./tile-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TileButtonComponent {
  @Input() tile: Tile | undefined;
}
