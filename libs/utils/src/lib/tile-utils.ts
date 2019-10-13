import { Tile, TileSuit, TILEMASK_HONOR, allTiles } from "@riichi/definitions";

export function getSuitFromTile(tile: Tile) {
    // tslint:disable-next-line: no-bitwise
    return (tile & 0xF0) as TileSuit;
}

export function getValueFromTile(tile: Tile) {
    // tslint:disable-next-line: no-bitwise
    return (tile & 0x0F) + 1;
}

export function getDoraFromIndicator(doraIndicator: Tile): Tile {
    const suit = getSuitFromTile(doraIndicator);
    const value = getValueFromTile(doraIndicator);
    return makeTile(suit, value + 1);
}

export function makeTile(suit: TileSuit, value: number) {
    return (suit + ((value - 1) % valuesInSuit(suit))) as Tile;
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
    const value = getValueFromTile(tile) - 1;
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
    return [].concat(...allTiles.map((t: Tile) => [t, t, t, t]));
}

export function isHonor(tile: Tile) {
    return tile >= TILEMASK_HONOR;
}

export function isSuited(tile: Tile) {
    return tile < TILEMASK_HONOR;
}

export function isSimple(tile: Tile) {
    const value = getValueFromTile(tile);
    return isSuited(tile) && value > 1 && value < 9;
}

export function isTerminal(tile: Tile) {
    const value = getValueFromTile(tile);
    return isSuited(tile) && (value === 1 || value === 9);
}

export function isTerminalOrHonor(tile: Tile) {
    const value = getValueFromTile(tile);
    return isHonor(tile) || value === 1 || value === 9;
}

export function handFromNotation(hand: string) {
    return hand.split(' ').map(s => {
        switch (s.charAt(0)) {
            case 'M': return makeTile(TileSuit.Man, parseInt(s.charAt(1), 10));
            case 'S': return s.length === 1 ? Tile.Nan : makeTile(TileSuit.Sou, parseInt(s.charAt(1), 10));
            case 'P': return makeTile(TileSuit.Pin, parseInt(s.charAt(1), 10));
            case 'N': return Tile.Pei;
            case 'E': return Tile.Ton;
            case 'W': return Tile.Shaa;
            case 'C': return Tile.Chun;
            case 'H': return Tile.Hatsu;
            case 'B': return Tile.Haku;
        }
    });
}