import { Tile, UnknownTile } from "@riichi/common";
import { distinctUntilChanged, map, Observable, ReplaySubject, shareReplay } from "rxjs";
import { GameDocument, PlayerInfo } from "./documents";
import { filterLogType, LogEntry, LogEntryType } from "./log-entry";
import { MoveFunctions } from "./moves";
import { DECK_SIZE } from "./utils";

export class GameService {
    constructor(
        public readonly gameId: string,
        protected readonly playerId: string,
        protected readonly gameDocument$: Observable<GameDocument>,
        public readonly move: MoveFunctions) {

        let logSize = 0;
        const tileValueSubjects$ = new Array(DECK_SIZE).fill(1).map(() => new ReplaySubject<Tile>());
        this.tileValues$ = tileValueSubjects$.map(s => s.pipe(distinctUntilChanged(), shareReplay(1)));
        const wallSubjects$ = new Array(DECK_SIZE).fill(1).map(() => new ReplaySubject<Tile | UnknownTile | null>());
        this.wall$ = wallSubjects$.map(s => s.pipe(distinctUntilChanged(), shareReplay(1)));

        const playerSubjects$ = new Array(4).fill(1).map(() => new ReplaySubject<PlayerInfo>(1));
        this.players$ = playerSubjects$.map(s => s.pipe(distinctUntilChanged(/* TODO */), shareReplay(1)));


        gameDocument$.subscribe(doc => {
            const takenTiles = doc.players.map(p => [p.hand, p.discards, p.melds.map(m => m.tiles)]).flat(3);

            for (let i = 0; i < 4; i++) {
                playerSubjects$[i].next(doc.players[i]);
            }

            for (let i = 0; i < DECK_SIZE; i++) {
                wallSubjects$[i].next(takenTiles.includes(i) ? null : (doc.knownTiles[i] ?? 'xx'))
            }

            for (let i = 0; i < doc.knownTiles.length; i++) {
                const tile = doc.knownTiles[i];
                if (tile !== null) {
                    tileValueSubjects$[i].next(tile);
                }
            }
    
            for (; logSize < doc.ledger.length; logSize++) {
                this.logSubject$.next(doc.ledger[logSize]);
            }
        })
    }

    private readonly logSubject$ = new ReplaySubject<LogEntry>();
    readonly log$ = this.logSubject$.asObservable();

    readonly wall$: Observable<Tile | UnknownTile | null>[];
    readonly players$: Observable<PlayerInfo>[];

    readonly diceValues$: Observable<readonly [number, number]> = this.log$.pipe(
        filterLogType(LogEntryType.DiceRolled),
        map(le => le.values)
    );

    /**
     * Array of observables with known tile values.
     * Each entry in the array represents a single tile and will only emit once the tile value is known
     * */
    readonly tileValues$: Observable<Tile>[];
}