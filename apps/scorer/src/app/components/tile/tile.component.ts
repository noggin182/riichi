import { Component, Input, ChangeDetectionStrategy, OnChanges, HostBinding } from '@angular/core';
import { Tile, TileSuit } from '@riichi/definitions';
import { getSuitFromTile, getValueFromTile } from '@riichi/utils';

import { State } from '../../state';

@Component({
    selector: 'scorer-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent implements OnChanges {
    constructor(private state: State) {
    }

    @Input() tile: Tile = Tile.Blank;
    Tile = Tile;

    back: string;
    front: string;

    @HostBinding('attr.data-tile')
    get tileName() { return Tile[this.tile] || 'Blank'; }

    ngOnChanges() {
        const base = this.state.blackTiles
                  ? 'riichi-mahjong-tiles/Black/'
                  : 'riichi-mahjong-tiles/Regular/';
        //this.back = base + 'Front.svg';
        //this.front = base + this.getTileName(this.tile) + '.svg';
    }



}
