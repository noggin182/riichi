import { TileKind, Dragon, Wind, Tile, TileRank } from '../types/tile';
import { randomNumberGenerator } from './random';

export function createDummySetOfTiles(): Tile[] {
    return [
        'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9',
        'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9',
        's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
        'z1', 'z2', 'z3', 'z4',
        'z5', 'z6', 'z7'
    ];
}

export function tileKind(tile: Tile): TileKind {
    return tile[0] as TileKind;
}

export function tileRank(tile: Tile): TileRank {
    return tile[1] as TileRank;
}

export function tileValue(tile: Tile): number {
    return +tile[1];
}

export function getDoraFromIndicator(indicator: Tile): Tile {
    if (indicator[0] === TileKind.Honor) {
        switch (indicator[1]) {
            case Wind.East:    return `${TileKind.Honor}${Wind.South}`;
            case Wind.South:   return `${TileKind.Honor}${Wind.West}`;
            case Wind.West:    return `${TileKind.Honor}${Wind.North}`;
            case Wind.North:   return `${TileKind.Honor}${Wind.East}`;
            case Dragon.Haku:  return `${TileKind.Honor}${Dragon.Hatsu}`;
            case Dragon.Hatsu: return `${TileKind.Honor}${Dragon.Chun}`;
            case Dragon.Chun:  return `${TileKind.Honor}${Dragon.Haku}`;
        }
    }

    return indicator[0] + (+indicator[1] % 9 + 1) as Tile;
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
    const presentSuits = tiles.map(t => t[0]);
    return [TileKind.Man, TileKind.Pin, TileKind.Sou].every(suit => presentSuits.includes(suit));
}

export function tileToUnicode(tile: Tile | null | '--') {
    if (tile && tile !== '--') {
        switch (tileKind(tile)) {
            case TileKind.Man:    return String.fromCodePoint(0x1F006 + tileValue(tile));
            case TileKind.Sou:    return String.fromCodePoint(0x1F00F + tileValue(tile));
            case TileKind.Pin:    return String.fromCodePoint(0x1F018 + tileValue(tile));
            case TileKind.Honor:
                switch (tileRank(tile)) {
                    case Dragon.Haku:  return String.fromCodePoint(0x1F006);
                    case Dragon.Hatsu: return String.fromCodePoint(0x1F005);
                    case Dragon.Chun:  return String.fromCodePoint(0x1F004);
                    default: return String.fromCodePoint(0x1EFFF + tileValue(tile));
                }
        }
    }
    return String.fromCodePoint(0x1F3B4); //String.fromCodePoint(0x1F02B);
}

// export function handToUnicode(tiles: TileDef[]) {
//     return tiles.map(tileToUnicode).join(' ');
// }

