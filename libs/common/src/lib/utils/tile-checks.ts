import { Tile, TileKind, Dragon, Wind } from '../types/tile';


export function isSuited(tile: Tile) {
    return tile.kind === TileKind.Man
        || tile.kind === TileKind.Sou
        || tile.kind === TileKind.Pin;
}

export function areSimilarTiles(tile1: Tile, tile2: Tile) {
    return tile1.kind === tile2.kind
        && tile1.rank === tile2.rank;
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
