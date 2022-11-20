import { TileKind, TileName, Dragon, Wind, Tile, TileNames } from '../types/tile';
import { randomNumberGenerator } from './random';

export const dummyBlankTile: Tile = {
    kind: TileKind.Unknown,
    rank: 0
};

export function createDummySetOfTiles(): Tile[] {
    return [
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(rank => ({kind: TileKind.Man,   rank})),
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(rank => ({kind: TileKind.Sou,   rank})),
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(rank => ({kind: TileKind.Pin,   rank})),
        ...[1, 2, 3, 4, 5, 6, 7      ].map(rank => ({kind: TileKind.Honor, rank}))
    ];
}

export function buildTileName(kind: TileKind, rank: number): TileName {
    return getTileName({kind, rank});
}

export function getTileName(tile: Tile): TileName {
    return TileNames[tile.kind][tile.rank].toString() as TileName;
}

export function getDoraNameFromIndicator(indicator: Tile) {
    if (indicator.kind === TileKind.Honor) {
        switch (indicator.rank) {
            case Wind.East:  return buildTileName(TileKind.Honor, Wind.South);
            case Wind.South: return buildTileName(TileKind.Honor, Wind.West);
            case Wind.West:  return buildTileName(TileKind.Honor, Wind.North);
            case Wind.North: return buildTileName(TileKind.Honor, Wind.East);
            case Dragon.Haku:  return buildTileName(TileKind.Honor, Dragon.Hatsu);
            case Dragon.Hatsu: return buildTileName(TileKind.Honor, Dragon.Chun);
            case Dragon.Chun:  return buildTileName(TileKind.Honor, Dragon.Haku);
        }
    }

    return buildTileName(indicator.kind, indicator.rank % 9 + 1);
}

export function sortTiles(tileA: Tile, tileB: Tile) {
    return tileA.kind - tileB.kind || tileA.rank - tileB.rank;
}

export function createNewDeck(rng?: Iterator<number>): Tile[] {
    const deck = [...createDummySetOfTiles(), ...createDummySetOfTiles(), ...createDummySetOfTiles(), ...createDummySetOfTiles()];

    rng ??= randomNumberGenerator();

    return deck
        .map(tile => ({tile, v: rng?.next().value}))
        .sort((t1, t2) => t1.v - t2.v)
        .map(t => t.tile);
}

export function allSuitsPresent(tiles: readonly Tile[]) {
    const presentSuits = tiles.map(t => t.kind);
    return [TileKind.Man, TileKind.Pin, TileKind.Sou].every(suit => presentSuits.includes(suit));
}

// export function tileToUnicode(tile: TileDef) {
//     const value = getValueFromTile(tile) - 1;
//     switch (getSuitFromTile(tile)) {
//         case TileSuit.Wind:   return String.fromCodePoint(0x1F000 + value);
//         case TileSuit.Dragon: return String.fromCodePoint(0x1F004 + value);
//         case TileSuit.Man:    return String.fromCodePoint(0x1F007 + value);
//         case TileSuit.Sou:    return String.fromCodePoint(0x1F010 + value);
//         case TileSuit.Pin:    return String.fromCodePoint(0x1F019 + value);
//     }
//     return String.fromCodePoint(0x1F02B);
// }

// export function handToUnicode(tiles: TileDef[]) {
//     return tiles.map(tileToUnicode).join(' ');
// }

