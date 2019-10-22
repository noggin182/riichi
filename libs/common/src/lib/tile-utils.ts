import { TileKind, TileName, Dragon, Wind, Tile } from './definitions/tile';
import { randomNumberGenerator } from './utils/random';

const DUMMY_TILE_ID = 0xFF;

export const dummyBlankTile: Tile = {
    id: DUMMY_TILE_ID,
    kind: TileKind.Unknown,
    rank: 0
};

export function createDummySetOfTiles(): Tile[] {
    return [
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(rank => ({id: DUMMY_TILE_ID, kind: TileKind.Man,   rank})),
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(rank => ({id: DUMMY_TILE_ID, kind: TileKind.Sou,   rank})),
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(rank => ({id: DUMMY_TILE_ID, kind: TileKind.Pin,   rank})),
        ...[1, 2, 3, 4, 5, 6, 7      ].map(rank => ({id: DUMMY_TILE_ID, kind: TileKind.Honor, rank}))
    ];
}

export function buildTileName(kind: TileKind, rank: number) {
    return kind * 10 + rank;
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

export function getTileName(tile: Tile): TileName {
    return tile.kind * 10 + tile.rank;
}

export function createNewDeck(rng?: Iterator<number>): Tile[] {
    const deck = [...createDummySetOfTiles(), ...createDummySetOfTiles(), ...createDummySetOfTiles(), ...createDummySetOfTiles()];
    if (!rng) {
        rng = randomNumberGenerator();
    }
    deck.forEach((tile: {id: number}) => {
        tile.id = rng.next().value;
    });
    deck.sort((t1, t2) => t1.id - t2.id);
    return deck;
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

