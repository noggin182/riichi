import { Wind, Tile } from './tiles';

export interface Meld {
    from: Wind | null;
    tiles: Tile[];
}

export enum HandStyle {
    Mahjong,
    SevenPairs,
    ThirteenOrphans
}

export interface Mahjong {
    style: HandStyle,
    melds: Meld[];
    concealed: Tile[][];
    pair: Tile[] | null; // null for 7 pairs and 13 orphans
}

