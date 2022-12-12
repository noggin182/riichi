import { Tile, Wind } from "@riichi/common";
import { LogEntry, TileIndex } from '@riichi/game-core';

// These interfaces are very similar to the public ones with only a couple 
// properties different. The big difference comes in it's mutability

export interface InternalPlayerInfo {
    readonly name: string;
    readonly id: string;
    readonly avatarUrl: string;
    seatWind: Wind;
    points: number;
    hand: TileIndex[];
    discards: TileIndex[];
    melds: {
        tiles: TileIndex[];
        claimedTile?: TileIndex;
    }[];
    knownTiles: TileIndex[];
}

/** The internal state of a game that should never be seen by the client */
export interface InternalGameDocument {
    readonly deck: readonly Tile[];
    prevelantWind: Wind;
    players: readonly InternalPlayerInfo[];
    ledger: LogEntry[];
}
