import { Wind, Tile } from './tile';

export const enum MeldKind {
    Chi,
    Pon,
    Kan,
    AddedKan,
    ClosedKan
}

export interface Meld {
    readonly kind: MeldKind;
    readonly from: Wind;
    readonly tiles: readonly Tile[];
    readonly claimedTile: Tile; // this tile should always be in the tiles array
}

export const enum FinalMeldKind {
    Chi = MeldKind.Chi,
    Pon = MeldKind.Pon,
    Kan = MeldKind.Kan,
    AddedKan  = MeldKind.AddedKan,
    ClosedKan = MeldKind.ClosedKan,
    Ron,
    Closed
}

export interface FinalMeld {
    readonly kind: FinalMeldKind;
    readonly from: Wind;
    readonly tiles: readonly Tile[];
    readonly claimedTile: Tile | null;
}

export interface Mahjong {
    readonly melds: readonly FinalMeld[];
}
