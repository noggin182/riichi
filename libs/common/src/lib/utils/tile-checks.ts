import { Tile, TileKind, Dragon, Wind } from '../types/tile';
import { tileKind, tileRank, tileValue } from './tile';

export function isSuited(tile: Tile) {
    return tileKind(tile) === TileKind.Man
        || tileKind(tile) === TileKind.Sou
        || tileKind(tile) === TileKind.Pin;
}

export function areSimilarTiles(tile1: Tile, tile2: Tile) {
    return tileKind(tile1) === tileKind(tile2)
        && tileRank(tile1) === tileRank(tile2);
}

export function isSimple(tile: Tile) {
    return isSuited(tile)
        && tileValue(tile) > 1
        && tileValue(tile) < 9;
}

export function isTerminal(tile: Tile) {
    return isSuited(tile)
        && (tileValue(tile) === 1 || tileValue(tile) === 9);
}

export function isTerminalOrHonor(tile: Tile) {
    return tileKind(tile) === TileKind.Honor
        || tileValue(tile) === 1
        || tileValue(tile) === 9;
}

export function isHonor(tile: Tile) {
    return tileKind(tile) === TileKind.Honor;
}

export function isDragon(tile: Tile) {
    return tileKind(tile) === TileKind.Honor
        && (tileRank(tile) === Dragon.Haku || tileRank(tile) === Dragon.Hatsu || tileRank(tile) === Dragon.Chun);
}

export function isWind(tile: Tile) {
    return tileKind(tile) === TileKind.Honor
        && (tileRank(tile) === Wind.East || tileRank(tile) === Wind.South || tileRank(tile) === Wind.West || tileRank(tile) === Wind.North);
}
