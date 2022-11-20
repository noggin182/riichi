import { Wind, Tile } from './tile';

export const enum MeldKind {
    /* The order here (and in FinalMeldKind) is used to sort groups when displaying winning hands */
    ConcealedKan = 3,
    Kan,
    AddedKan,
    Chi,
    Pon
}

export interface OpenMeld {
    readonly kind: MeldKind;
    readonly from: Wind;
    readonly tiles: readonly Tile[];
    readonly claimedTile: Tile | null;
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
    ClosedSet,
    ClosedKan    = MeldKind.ConcealedKan,
    OpenKan      = MeldKind.Kan,
    OpenAddedKan = MeldKind.AddedKan,
    OpenChi      = MeldKind.Chi,
    OpenPon      = MeldKind.Pon,
    ClosedPair,
    OpenPair,
    Orphans
}

export interface FinalMeld {
    readonly kind: FinalMeldKind;
    readonly from: Wind;
    readonly tiles: readonly Tile[];
    readonly claimedTile: Tile | null;
    readonly finalSet: boolean;
}

export interface Mahjong {
    readonly melds: readonly FinalMeld[];
    readonly finalTile: Tile;
}
