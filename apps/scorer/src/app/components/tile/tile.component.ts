import { Component, Input, ChangeDetectionStrategy, OnChanges, HostBinding } from '@angular/core';
import { Tile, TileKind, Wind, Dragon } from '@riichi/common';

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

    @HostBinding('attr.data-size')
    @Input() size: 'normal' | 'small' | 'tiny' = 'normal';
    @Input() tile: Tile;

    back: string;
    front: string;

    @HostBinding('attr.data-tile')
    get tileName() {
        switch (this.tile.kind) {
            case TileKind.Man: return 'Man' + this.tile.rank;
            case TileKind.Pin: return 'Pin' + this.tile.rank;
            case TileKind.Sou: return 'Sou' + this.tile.rank;
            case TileKind.Honor: {
                switch (this.tile.rank) {
                    case Wind.East:  return 'Ton';
                    case Wind.South: return 'Nan';
                    case Wind.West:  return 'Shaa';
                    case Wind.North: return 'Pei';
                    case Dragon.Chun:  return 'Chun';
                    case Dragon.Haku:  return 'Haku';
                    case Dragon.Hatsu: return 'Hatsu';
                }
            }
        }
        return 'Blank';
    }

    ngOnChanges() {
        // this.back = base + 'Front.svg';
        // this.front = base + this.getTileName(this.tile) + '.svg';
    }



}
