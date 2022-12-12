import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation,
    EventEmitter,
    inject,
    Pipe,
    PipeTransform,
    OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tile, UnknownTile } from '@riichi/common';
import { TileComponent } from '@riichi/components';
import { DECK_SIZE, filterLogType, GameService, LogEntry, LogEntryType, PlayerIndex, TileIndex } from '@riichi/game-core';
import { BehaviorSubject, filter, map, Observable, Subscription, scan } from 'rxjs';
import { TileClickBehaviour, TILE_CLICK_BEHAVIOUR } from '../state/state';

@Pipe({ name: 'tileIsSplit', standalone: true })
export class TileIsSplitPipe implements PipeTransform {
    transform(log$: Observable<LogEntry>, tileIndex: number) {
        return log$.pipe(
            filterLogType(LogEntryType.WallSplit),
            filter(le => le.afterTile === tileIndex),
            map(() => true)
        );
    }
}

@Component({
    selector: 'rth-wall-side',
    standalone: true,
    imports: [CommonModule, TileComponent, TileIsSplitPipe],
    templateUrl: './wall-side.component.html',
    styleUrls: ['./wall-side.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WallSideComponent implements OnChanges, OnDestroy {
    protected wallStart: number | undefined;
    protected deadWallStart: number | undefined;
    protected tiles!: (Tile | UnknownTile | undefined)[];
    @HostBinding('class.rth-wall-side--ready-to-break')
    protected readyToBreak = false;

    @HostBinding('attr.data-seat')
    @Input() seat!: PlayerIndex;
    @Input() gameService!: GameService;
    @Output() tileClick = new EventEmitter<{tileIndex: TileIndex, type: 'split' | 'flip' | 'take'}>();

    protected tileIndexes!: TileIndex[];

    protected readonly tileClickBehaviour$ = inject<BehaviorSubject<TileClickBehaviour>>(TILE_CLICK_BEHAVIOUR);

    @HostBinding('style.--number-of-splits')
    protected numberOfSplits = 0;
    protected numberOfSplitsSubscription: Subscription | undefined;

    ngOnChanges(changes: SimpleChanges): void {
        if ('seat' in changes) {
            // This wall goes clockwise
            const sideStart = [0, 3, 2, 1][this.seat] * (DECK_SIZE / 4);
            this.tileIndexes = new Array(DECK_SIZE / 4).fill(1).map((_, i) => sideStart + i);
        }

        if ('seat' in changes || 'gameService' in changes) {
            if (this.numberOfSplitsSubscription) {
                this.numberOfSplitsSubscription.unsubscribe();
            }
            this.numberOfSplits = 0;
            this.numberOfSplitsSubscription = this.gameService.log$
                .pipe(
                    filterLogType(LogEntryType.WallSplit),
                    filter(le => this.tileIndexes.includes(le.afterTile)),
                    scan((count) => count + 1, 0),
                ).subscribe(c => this.numberOfSplits = c);
        }

        // const wallStart = findInLedger(this.gameState, LogEntryType.DealWallSectioned)?.startingAt;

        // if (wallStart !== undefined) {
        //     this.wallStart = wallStart - this.sideStart;
        //     // todo, take into account kan
        //     this.deadWallStart = ((wallStart - 14 + DECK_SIZE) % DECK_SIZE) - this.sideStart;
        // }

        // this.readyToBreak = this.wallStart == undefined && findInLedger(this.gameState, LogEntryType.DiceRolled) != undefined;

        // this.tiles = this.gameState.wall.slice(this.sideStart, this.sideStart + DECK_SIZE / 4).map(index => index === null ? undefined : this.gameState.knownTiles[index] ?? 'xx');
    }

    ngOnDestroy(): void {
        if (this.numberOfSplitsSubscription) {
            this.numberOfSplitsSubscription.unsubscribe();
        }
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
