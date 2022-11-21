import { Tile, Wind } from "./tile";

export type TileIndex = number;
export type DeckTile = Tile | '--';

export interface GameState {
    prevelantWind: Wind,
    deck: DeckTile[];
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