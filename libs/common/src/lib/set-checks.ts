import { Tile, TileKind } from './definitions/tile';
import { areSimilarTiles } from './tile-checks';

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
