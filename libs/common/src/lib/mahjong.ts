import { isTerminalOrHonor, getValueFromTile, isHonor } from './tile-utils';
import { Tile, allTiles } from './definitions/tiles';
import { Meld, Mahjong } from './definitions/mahjong-definition';

type ConcealedSet = Tile[];
type ConcealedHand = ConcealedSet[];

function count(hand: Tile[], tile: Tile) {
    return hand.filter(t => t === tile).length;
}

function removeTiles(hand: Tile[], tile1: Tile, tile2: Tile) {
    const index1 = hand.indexOf(tile1);
    const index2 = tile1 === tile2 ? hand.indexOf(tile2, index1 + 1) : hand.indexOf(tile2);
    return hand.filter((_ , i) => i !== index1 && i !== index2);
}

export function calculateWaits(hand: Tile[], melds: Meld[]) {
    return allTiles.filter(tile => checkForMahjong(hand.concat(tile), melds).length);
}

export function checkForMahjong(hand: Tile[], melds: Meld[]): Mahjong[] {
    hand = hand.slice().sort();
    const mahjong: Mahjong[] = [];

    if (hand.length + (melds.length * 3) !== 14) {
        throw new Error('unexpected number of tiles in hand');
    }

    const distinctTiles = hand.filter((t, i) => hand.indexOf(t) === i);

    if (!melds.length) {
        // manual check for 13 orphans
        if (distinctTiles.length === 13 && distinctTiles.every(isTerminalOrHonor)) {
            return [{
                melds: [],
                concealed: [hand],
                pair: null
            }];
        }
        // manual check for 7 pairs
        if (distinctTiles.length === 7 && distinctTiles.every(t => count(hand, t) === 2)) {
            mahjong.push({
                melds: [],
                concealed: distinctTiles.map(t => [t, t]),
                pair: null});
            // don't return, other hands may be valid (Ryan peikou)
        }
    }

    // first take out the pairs
    const pairs = distinctTiles.filter(t => count(hand, t) >= 2);
    for (const pairedTile of pairs) {
        const pair = [pairedTile, pairedTile];
        const current = removeTiles(hand, pairedTile, pairedTile);

        const hands: ConcealedHand[] = [];
        walk(current, [], hands);
        mahjong.push(...hands.map(sets => ({
            melds,
            concealed: sets.concat(),
            pair
        })));
    }
    return mahjong;
}

function walk(remainingTiles: Tile[], currentSets: ConcealedSet[], hands: ConcealedHand[]) {
    if (!remainingTiles.length) {
        hands.push(currentSets);
        return;
    }

    if (remainingTiles.length % 3) {
        throw new Error('unexpected number of tiles left in hand');
    }

    const tile = remainingTiles.shift();
    if (!isHonor(tile) && getValueFromTile(tile) <= 7) {
        const tile1 = tile + 1;
        const tile2 = tile + 2;
        if (remainingTiles.includes(tile1) && remainingTiles.includes(tile2)) {
            // make a run
            walk(removeTiles(remainingTiles, tile1, tile2),
                 currentSets.concat([[tile, tile1, tile2]]),
                 hands);
        }
    }
    if (tile === remainingTiles[0] && tile === remainingTiles[1]
        && tile !== remainingTiles[2] /* don't take a pon if there are 4, we already took the chi */) {
        walk(removeTiles(remainingTiles, tile, tile),
             currentSets.concat([[tile, tile, tile]]),
             hands);
    }

}
