import { createNewDeck, GameState, InternalGameState, Tile, TileIndex, Wind } from "@riichi/common";
import { RiichiServerConnection } from "@riichi/server-core";
import { BehaviorSubject, delay as rxDelay, map, Subject } from "rxjs";

export function testServer(): string {
    return 'test-server';
}

function delay(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

const DECK_SIZE = (9 + 9 + 9 + 4 + 3) * 4;

export class TestServer {
    constructor() {
        const wallBreak = Math.floor(Math.random() * DECK_SIZE);
        this.internalState = {
            deck: createNewDeck(),
            wallStart: wallBreak,
            wallPointer: wallBreak,
            playerStates: {
                [Wind.East]:  { deck: this.playerDecks$Map[Wind.East].value  },
                [Wind.South]: { deck: this.playerDecks$Map[Wind.South].value },
                [Wind.West]:  { deck: this.playerDecks$Map[Wind.West].value  },
                [Wind.North]: { deck: this.playerDecks$Map[Wind.North].value },
            }
        };

        this.gameSubject$ = new BehaviorSubject<GameState>({
            // deck: this.internalDeck.map((t, i) => this.displayed[i] ? t : '--'),
            wall: new Array(DECK_SIZE).fill(1).map((_, i) => i),
            prevelantWind: Wind.East,
            players: {
                [Wind.East]: {
                    name: 'East',
                    id: 'east',
                    avatarUrl: 'east.png',
                    points: 1000,
                    hand: [],
                    discards: [],
                    melds: [],
                    riichiTile: undefined
                },
                [Wind.South]: {
                    name: 'South',
                    id: 'south',
                    avatarUrl: 'south.png',
                    points: 1000,
                    hand: [],
                    discards: [],
                    melds: [],
                    riichiTile: undefined
                },
                [Wind.West]: {
                    name: 'West',
                    id: 'west',
                    avatarUrl: 'west.png',
                    points: 1000,
                    hand: [],
                    discards: [],
                    melds: [],
                    riichiTile: undefined
                },
                [Wind.North]: {
                    name: 'North',
                    id: 'north',
                    avatarUrl: 'north.png',
                    points: 1000,
                    hand: [],
                    discards: [],
                    melds: [],
                    riichiTile: undefined
                },
            }
        });
        delay(2000).then(() => this.deal());
    }

    private readonly playerDecks$Map: Record<Wind, BehaviorSubject<(Tile | null)[]>> = {
        [Wind.East]:  new BehaviorSubject(new Array<Tile | null>(DECK_SIZE).fill(null)),
        [Wind.South]: new BehaviorSubject(new Array<Tile | null>(DECK_SIZE).fill(null)),
        [Wind.West]:  new BehaviorSubject(new Array<Tile | null>(DECK_SIZE).fill(null)),
        [Wind.North]: new BehaviorSubject(new Array<Tile | null>(DECK_SIZE).fill(null))
    }

    connect(player: Wind): RiichiServerConnection {
        return {
            gameState$: this.gameSubject$.pipe(rxDelay(1)),
            playerState$: this.playerDecks$Map[player].pipe(map(deck => ({deck}))),
            discard: (tileIndex) => {
                this.discardTile(player, tileIndex);
                return Promise.resolve();
            },
            drawTile: (tileIndex) => {
                 this.moveNextTileToHand(player);
                 return Promise.resolve();
            }
        };
    }

    readonly internalState: InternalGameState;

    private gameSubject$: BehaviorSubject<GameState>;

    private moveNextTileToHand(playerWind: Wind) {
        const tileIndex = this.internalState.wallPointer;
        const state = JSON.parse(JSON.stringify(this.gameSubject$.value)) as GameState;
        state.players[playerWind].hand = [...state.players[playerWind].hand, tileIndex];
        state.wall[tileIndex] = null;
        
        this.gameSubject$.next(state);
        this.revealTileToPlayer(playerWind, tileIndex);

        if (++this.internalState.wallPointer == DECK_SIZE) {
            this.internalState.wallPointer = 0;
        }
    }

    private revealTileToPlayer(playerWind: Wind, tileIndex: TileIndex) {
        const playerDeck$ = this.playerDecks$Map[playerWind];
        playerDeck$.next(playerDeck$.value.map((v, i) => i === tileIndex ? this.internalState.deck[i] : v));
    }

    private discardTile(playerWind: Wind, tileIndex: number) {
        const state = JSON.parse(JSON.stringify(this.gameSubject$.value)) as GameState;
        const indexInHand = state.players[playerWind].hand.indexOf(tileIndex)
        if (indexInHand !== -1) {
            state.players[playerWind].hand.splice(indexInHand, 1);
            state.players[playerWind].discards = [...state.players[playerWind].discards, tileIndex];
            
            for (const wind of [Wind.East, Wind.South, Wind.West, Wind.North]) {
                if (wind !== playerWind) {
                    this.revealTileToPlayer(wind, tileIndex);
                }
            }

            this.gameSubject$.next(state);
        }
    }

    private async deal() {
        for (let ti = 0; ti < 13; ti++) {
            for (const wind of [Wind.East, Wind.South, Wind.West, Wind.North]) {
                this.moveNextTileToHand(wind);
                await delay(200);
            }
        }
    }

}