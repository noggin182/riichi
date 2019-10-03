import { Tile, TileSuit } from "@riichi/definitions";

export function getSuitFromTile(tile: Tile) {
    // tslint:disable-next-line: no-bitwise
    return (tile & 0xF0) as TileSuit;
}

export function getValueFromTile(tile: Tile) {
    // tslint:disable-next-line: no-bitwise
    return tile & 0x0F;
}

export function getDoraFromIndicator(doraIndicator: Tile): Tile {
    const suit = getSuitFromTile(doraIndicator);
    const value = getValueFromTile(doraIndicator);
    return makeTile(suit, value + 1);
}

export function makeTile(suit: TileSuit, value: number) {
    return (suit + (value % valuesInSuit(suit))) as Tile;
}

export function valuesInSuit(suit: TileSuit) {
    switch (suit) {
        case TileSuit.Man: 
        case TileSuit.Sou:
        case TileSuit.Pin:
            return 9;
        case TileSuit.Wind:
            return 4;
        case TileSuit.Dragon:
            return 3;
        case TileSuit.None:
        default:
            return 0;
    }
}

export function tileToUnicode(tile: Tile) {
    const value = getValueFromTile(tile);
    switch (getSuitFromTile(tile)) {
        case TileSuit.Wind:   return String.fromCodePoint(0x1F000 + value);
        case TileSuit.Dragon: return String.fromCodePoint(0x1F004 + value);
        case TileSuit.Man:    return String.fromCodePoint(0x1F007 + value);
        case TileSuit.Sou:    return String.fromCodePoint(0x1F010 + value);
        case TileSuit.Pin:    return String.fromCodePoint(0x1F019 + value);
    }
    return String.fromCodePoint(0x1F02B);
}

export function handToUnicode(tiles: Tile[]) {
    return tiles.map(tileToUnicode).join(' ')
}

export function createNewDeck(): Tile[] {
    return [].concat(...Object.keys(Tile).map(name => Tile[name]).filter(t => t && typeof t === 'number').map((t: Tile) => [t, t, t, t]));
}