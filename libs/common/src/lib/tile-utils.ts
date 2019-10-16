import { TileKind, DUMMY_TILE_ID, TileName, Dragon, Wind, Tile } from './definitions/tile';

export const dummyBlankTile: Tile = {
    id: 0xFF,
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

export function areSimilarTiles(tile1: Tile, tile2: Tile) {
    return tile1.kind === tile2.kind
        && tile1.rank === tile2.rank;
}

export function getTileName(tile: Tile): TileName {
    return tile.kind * 10 + tile.rank;
}

export function isSimple(tile: Tile) {
    return isSuited(tile)
        && tile.rank > 1
        && tile.rank < 9;
}

export function isTerminal(tile: Tile) {
    return isSuited(tile)
        && (tile.rank === 1 || tile.rank === 9);
}

export function isTerminalOrHonor(tile: Tile) {
    return tile.kind === TileKind.Honor
        || tile.rank === 1
        || tile.rank === 9;
}

export function isHonor(tile: Tile) {
    return tile.kind === TileKind.Honor;
}

export function isDragon(tile: Tile) {
    return tile.kind === TileKind.Honor
        && (tile.rank === Dragon.Haku || tile.rank === Dragon.Hatsu || tile.rank === Dragon.Chun);
}

export function isWind(tile: Tile) {
    return tile.kind === TileKind.Honor
        && (tile.rank === Wind.East || tile.rank === Wind.South || tile.rank === Wind.West || tile.rank === Wind.North);
}

export function isSuited(tile: Tile) {
    return tile.kind === TileKind.Man
        || tile.kind === TileKind.Sou
        || tile.kind === TileKind.Pin;
}


// =============== set based functions ===============
export function allSuitsPresent(tiles: readonly Tile[]) {
    const presentSuits = tiles.map(t => t.kind);
    return [TileKind.Man, TileKind.Pin, TileKind.Sou].every(suit => presentSuits.includes(suit));
}

export function isPonOrKan(tiles: readonly Tile[]) {
    return areSimilarTiles(tiles[0], tiles[1]);
}

export function isKan(tiles: readonly Tile[]) {
    return tiles.length === 4 && areSimilarTiles(tiles[0], tiles[1]);
}

export function isPon(tiles: readonly Tile[]) {
    return tiles.length === 3 && areSimilarTiles(tiles[0], tiles[1]);
}

export function isChi(tiles: readonly Tile[]) {
    return tiles.length === 3 && !areSimilarTiles(tiles[0], tiles[1]);
}

// import { TileDef, TileSuit, TILEMASK_HONOR, allTiles } from './definitions/tiles';
// import { Tile } from './definitions/tile';

// export function getSuitFromTile(tile: TileDef | Tile) {
//     // tslint:disable-next-line: no-bitwise
//     return (tile & 0xF0) as TileSuit;
// }

// export function getValueFromTile(tile: TileDef | Tile) {
//     // tslint:disable-next-line: no-bitwise
//     return (tile & 0x0F) + 1;
// }

// export function getDoraFromIndicator(doraIndicator: TileDef | Tile): TileDef {
//     const suit = getSuitFromTile(doraIndicator);
//     const value = getValueFromTile(doraIndicator);
//     return makeTileDef(suit, value + 1);
// }

// export function makeTileDef(suit: TileSuit, value: number) {
//     return (suit + ((value - 1) % valuesInSuit(suit))) as TileDef;
// }

// export const DUMMY_TILE_INDEX = 0xFF;
// export function buildTile(tile: TileDef, id: number): Tile {
//     return id * 0x100 + tile;
// }

// export function getDefFromTile(tile: Tile): TileDef {
//     // tslint:disable-next-line: no-bitwise
//     return tile & 0xFF;
// }

// export function valuesInSuit(suit: TileSuit) {
//     switch (suit) {
//         case TileSuit.Man:
//         case TileSuit.Sou:
//         case TileSuit.Pin:
//             return 9;
//         case TileSuit.Wind:
//             return 4;
//         case TileSuit.Dragon:
//             return 3;
//         case TileSuit.None:
//         default:
//             return 0;
//     }
// }

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

// export function createNewDeck(): TileDef[] {
//     return [].concat(...allTiles.map((t: TileDef) => [t, t, t, t]));
// }

// export function isHonor(tile: TileDef) {
//     return tile >= TILEMASK_HONOR;
// }

// export function isSuited(tile: TileDef) {
//     return tile < TILEMASK_HONOR;
// }

// export function isSimple(tile: TileDef) {
//     const value = getValueFromTile(tile);
//     return isSuited(tile) && value > 1 && value < 9;
// }

// export function isTerminal(tile: TileDef) {
//     const value = getValueFromTile(tile);
//     return isSuited(tile) && (value === 1 || value === 9);
// }

// export function isTerminalOrHonor(tile: TileDef) {
//     const value = getValueFromTile(tile);
//     return isHonor(tile) || value === 1 || value === 9;
// }

// export function handFromNotation(hand: string) {
//     return hand.split(' ').map(s => {
//         switch (s.charAt(0)) {
//             case 'M': return makeTileDef(TileSuit.Man, parseInt(s.charAt(1), 10));
//             case 'S': return s.length === 1 ? TileDef.Nan : makeTileDef(TileSuit.Sou, parseInt(s.charAt(1), 10));
//             case 'P': return makeTileDef(TileSuit.Pin, parseInt(s.charAt(1), 10));
//             case 'N': return TileDef.Pei;
//             case 'E': return TileDef.Ton;
//             case 'W': return TileDef.Shaa;
//             case 'C': return TileDef.Chun;
//             case 'H': return TileDef.Hatsu;
//             case 'B': return TileDef.Haku;
//         }
//     });
// }
