import { Tile, Wind } from "./tile";

export type TileIndex = number;

// Holds information about the current game that is NOT visible to players
export interface InternalGameState {
    deck: Tile[];
    wallStart: number;
    wallPointer: number;
    playerStates: Record<Wind, PlayerState>;
}

export interface GameState {
    prevelantWind: Wind,
    wall: (TileIndex | null)[];
    players: Record<Wind, {
        name: string,
        id: string,
        avatarUrl: string,
        points: number,
        hand: TileIndex[],
        discards: TileIndex[],
        melds: {
            tiles: TileIndex[];
            claimedTile: TileIndex | undefined;
        }[],
        riichiTile: TileIndex | undefined
    }>;
}

export interface PlayerState {
    deck: (Tile | null)[];
}