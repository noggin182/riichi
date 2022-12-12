import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from '@riichi/components';
import { DECK_SIZE, GameService, PlayerIndex, TileIndex } from '@riichi/game-core';
import { BehaviorSubject } from 'rxjs';
import { TileClickBehaviour, TILE_CLICK_BEHAVIOUR } from '../state/state';
import { PadPipe } from '../pipes/pad.pipe';

@Component({
    selector: 'rth-hand',
    standalone: true,
    imports: [CommonModule, TileComponent, PadPipe],
    templateUrl: './hand.component.html',
    styleUrls: ['./hand.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandComponent implements OnChanges {
    @Input() gameService!: GameService;
    @Input() seat!: PlayerIndex;

    protected slots!: number[];

    protected readonly tileClickBehaviour$ = inject<BehaviorSubject<TileClickBehaviour>>(TILE_CLICK_BEHAVIOUR);

    ngOnChanges(): void {
        this.slots = new Array(14).fill(1).map((_, i) => i);
    }

    protected clickTile(tileIndex: TileIndex) {
        switch (this.tileClickBehaviour$.value) {
            case TileClickBehaviour.SplitAfter: {
                this.gameService.move.splitWall(tileIndex);
                break;
            }
            case TileClickBehaviour.SplitBefore: {
                this.gameService.move.splitWall((tileIndex + DECK_SIZE - 2) % DECK_SIZE);
                break;
            }
            case TileClickBehaviour.Flip: {
                this.gameService.move.flipTileInWall(tileIndex);
                break;
            }
            case TileClickBehaviour.Take: {
                this.gameService.move.takeTile(tileIndex);
                break;
            }
            case TileClickBehaviour.Discard: {
                this.gameService.move.discard(tileIndex);
                break;
            }
        }
    }
}

