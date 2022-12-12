import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tile, UnknownTile, Wind } from '@riichi/common';
import { TileComponent } from '@riichi/components';
import { GameService } from '@riichi/game-core';

const DISCARD_COUNT = 24;

@Component({
    selector: 'rth-discards',
    standalone: true,
    imports: [CommonModule, TileComponent],
    templateUrl: './discards.component.html',
    styleUrls: ['./discards.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscardsComponent implements OnChanges {
    @HostBinding('attr.data-seat')
    @Input() seat!: Wind;
    @Input() gameService!: GameService;

    protected slots!: number[];
    protected discards!: (Tile | UnknownTile | undefined)[];

    ngOnChanges(): void {
        // const discards = this.gameState.players[this.seat].discards.map(ti => this.gameState.knownTiles[ti] ?? 'xx');
        // this.discards = discards.length < DISCARD_COUNT ? [...discards, ...new Array<undefined>(DISCARD_COUNT - discards.length).fill(undefined)] : discards;
    }
}
