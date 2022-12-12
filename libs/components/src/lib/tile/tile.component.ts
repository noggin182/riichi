import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { Tile, UnknownTile } from '@riichi/common';

@Component({
    selector: 'riichi-tile',
    standalone: true,
    template: '',
    styleUrls: ['./tile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
    /**
     * The tile value to display.
     * UnknownTile will display the back of a tile
     * undefined will render a placeholder for the tile
     */
    @HostBinding('attr.data-tile')
    @Input() tile: Tile | UnknownTile | undefined;

    @HostBinding('class.riichi-tile--rotate')
    @Input() rotated = false;
}
