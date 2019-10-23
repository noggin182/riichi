import { Wind, Tile } from './tile';

export const enum MeldKind {
    Chi,
    Pon,
    Kan,
    AddedKan,
    ClosedKan
}

export interface OpenMeld {
    readonly kind: MeldKind;
    readonly from: Wind;
    readonly tiles: readonly Tile[];
    readonly claimedTile: Tile;
}

export interface Hand {
    readonly concealedTiles: Tile[];
    readonly melds: OpenMeld[];
}

export interface ReadonlyHand {
    readonly concealedTiles: readonly Tile[];
    readonly melds: readonly OpenMeld[];
}

export const enum FinalMeldKind {
    OpenChi = MeldKind.Chi,
    OpenPon = MeldKind.Pon,
    OpenKan = MeldKind.Kan,
    OpenAddedKan = MeldKind.AddedKan,
    ClosedKan    = MeldKind.ClosedKan,
    ClosedSet,
    ClosedPair,
    OpenPair,
    Orphans
}

export interface FinalMeld {
    readonly kind: FinalMeldKind;
    readonly from: Wind;
    readonly tiles: readonly Tile[];
    readonly claimedTile: Tile | null;
}

export interface Mahjong {
    readonly melds: readonly FinalMeld[];
    readonly finalTile: Tile;
}
