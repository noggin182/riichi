import { Component, Input, ChangeDetectionStrategy, HostBinding, ViewEncapsulation } from '@angular/core';
import { Tile, TileKind, Wind, Dragon, tileRank, tileKind } from '@riichi/common';

@Component({
    selector: 'scorer-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {
    @HostBinding('attr.data-size')
    @Input() size: 'normal' | 'small' | 'tiny' = 'normal';
    @Input() tile: Tile | undefined;

    @Input() finalTile = false;
    @Input() claimed = false;

    @HostBinding('attr.data-rotated')
    get claimedAttribute() { return this.claimed || null; }

    @HostBinding('attr.data-final')
    get finalAttribute() { return this.finalTile || null; }

    back: string | undefined;
    front: string | undefined;

    @HostBinding('attr.data-tile')
    get tileName() {
        if (this.tile) {
            switch (tileKind(this.tile)) {
                case TileKind.Man: return 'Man' + tileRank(this.tile);
                case TileKind.Pin: return 'Pin' + tileRank(this.tile);
                case TileKind.Sou: return 'Sou' + tileRank(this.tile);
                case TileKind.Honor: {
                    switch (tileRank(this.tile)) {
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
        }
        return 'Blank';
    }
}
