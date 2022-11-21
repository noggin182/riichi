import { Tile, TileIndex, Wind } from "./tile";

export interface GameState {
    prevelantWind: Wind,
    deck: Tile[];
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
        riichiTile: TileIndex
    }>;
}