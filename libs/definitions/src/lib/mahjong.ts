import { Wind, Tile } from './tiles';

export interface Meld {
    from: Wind | null;
    tiles: Tile[];
}

export interface Mahjong {
    melds: Meld[];
    concealed: Tile[][];
    pair: Tile[] | null; // null for 7 pairs and 13 orphans
}

