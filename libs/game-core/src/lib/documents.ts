import { Tile, Wind } from "@riichi/common";
import { LogEntry } from "./log-entry";

// ================================================
//  This file only contains PUBLIC documents
// ================================================

export type TileIndex = number;
export type PlayerIndex = 0 | 1 | 2 | 3;

export interface PlayerInfo {
    readonly name: string;
    readonly id: string;
    readonly avatarUrl: string;
    readonly seatWind: Wind;
    readonly points: number;
    readonly hand: readonly TileIndex[];
    readonly discards: readonly TileIndex[];
    readonly melds: {
        readonly tiles: readonly TileIndex[];
        readonly claimedTile?: TileIndex;
    }[];
}

/**
 * The state of the game as seen by the document's owner
 */
export interface GameDocument {
    readonly prevelantWind: Wind;
    readonly players: readonly PlayerInfo[];
    readonly knownTiles: readonly (Tile | null)[];
    readonly ledger: readonly LogEntry[];
}
