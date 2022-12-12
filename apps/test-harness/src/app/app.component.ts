import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Wind } from '@riichi/common';
import { TestServer } from '@riichi/test-server';
import { TableComponent } from './table/table.component';
import { filterLogType, GameService, LogEntry, LogEntryType, PlayerIndex } from '@riichi/game-core';
import { PlayerSelectComponent } from './player-select/player-select.component';
import { BehaviorSubject, skip, take } from 'rxjs';
import { TileClickBehaviour, TILE_CLICK_BEHAVIOUR } from './state/state';
import { TileClickBehaviourSelectComponent } from './tile-click-behaviour-select/tile-click-behaviour-select.component';

/*
@Pipe({name: 'tileUnicode', standalone: true}) export class TilePipe implements PipeTransform {
    transform(value: Tile | '--') {
        return tileToUnicode(value);
    }
}

@Pipe({name: 'pad', standalone: true}) export class PadPipe implements PipeTransform {
    transform<T>(array: readonly T[], length: number, value: T): readonly T[] {
        return array.length >= length
             ? array 
             : [...array, ...new Array(length - array.length).fill(value)];
    }
}

@Pipe({name: 'sort', standalone: true}) export class SortPipe implements PipeTransform {
    transform<T>(array: readonly T[], compareFn?: (a: T, b: T) => number): T[] {
        return array.slice().sort(compareFn);
    }
}
*/

@Component({
    standalone: true,
    imports: [
        CommonModule,
        PlayerSelectComponent,
        TileClickBehaviourSelectComponent,
        TableComponent
    ],
    providers: [
        TestServer,
        {
            provide: TILE_CLICK_BEHAVIOUR,
            useValue: new BehaviorSubject<TileClickBehaviour>(TileClickBehaviour.SplitAfter)
        }
    ],
    selector: 'rth-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

    protected activePlayerIndex: PlayerIndex = 0;

    protected readonly windChars: Record<Wind, string> = {
        [Wind.East]:  '東',
        [Wind.South]: '南',
        [Wind.West]:  '西',
        [Wind.North]: '北',
    };

    protected readonly east  = Wind.East;
    protected readonly south = Wind.South;
    protected readonly west  = Wind.West;
    protected readonly north = Wind.North;

    protected readonly testServer = inject(TestServer);
    protected readonly tileClickBehaviour$ = inject<BehaviorSubject<TileClickBehaviour>>(TILE_CLICK_BEHAVIOUR);

    protected readonly playerConnections: GameService[] = [
        this.testServer.connect(0),
        this.testServer.connect(1),
        this.testServer.connect(2),
        this.testServer.connect(3),
    ];

    protected get activeConnection() { return this.playerConnections[this.activePlayerIndex]; }

    constructor() {
        const splits$ = this.playerConnections[0].log$.pipe(filterLogType(LogEntryType.WallSplit));
        splits$.pipe(take(1)).subscribe(() => {
            console.log("switching to split before")
            this.tileClickBehaviour$.next(TileClickBehaviour.SplitBefore);}
            );
        splits$.pipe(skip(1), take(1)).subscribe(() => this.tileClickBehaviour$.next(TileClickBehaviour.Flip));
        this.playerConnections[0].log$.pipe(filterLogType(LogEntryType.FlippedTileInWall)).subscribe(() => this.tileClickBehaviour$.next(TileClickBehaviour.Take));
    }


    // protected readonly aiPlayers = [Wind.East, Wind.South, Wind.West, Wind.North]
    //     .filter (w => w !== this.playerWind)
    //     .map(wind => new SimpleAi(wind, this.testServer.connect(wind)));

    // protected sortTiles$ = this.connection.game$.pipe(map(state => (tileA: TileIndex, tileB: TileIndex) => state.knownTiles[tileA]?.localeCompare(state.knownTiles[tileB] ?? '') ?? 0));

    // protected clickWall(tileIndex: TileIndex, type: 'split' | 'flip' | 'take') {
    //     if (type === 'split') {
    //         this.playerConnections[this.activeSeat].move.splitWall(tileIndex);
    //     } else if (type === 'flip') {
    //         this.playerConnections[this.activeSeat].move.flipTileInWall(tileIndex);
    //     } else if (type === 'take') {
    //         this.playerConnections[this.activeSeat].move.takeTile(tileIndex);
    //     }

    // }

    // protected drawTile() {
    //     this.connection.move.takeTile(-1);
    // }

    // protected discard(tileIndex: number) {
    //     this.connection.move.discard(tileIndex);
    // }

    protected findDiceRoll(ledger: LogEntry[]) {
        return ledger.filter(le => le.type === LogEntryType.DiceRolled).at(-1) as (LogEntry & {type: LogEntryType.DiceRolled});
    }

    protected die(index: number | undefined | null) {
        // const roll = findInLedger(gameState, LogEntryType.DiceRolled);
        return index == undefined ? '🎲' : String.fromCodePoint(0x267F + index);
    }
}
