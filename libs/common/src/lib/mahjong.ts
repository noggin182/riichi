import { createDummySetOfTiles, sortTiles, getTileName, isTerminalOrHonor, isSuited } from './tile-utils';
import { Meld, Mahjong, FinalMeld, MeldKind, FinalMeldKind } from './definitions/mahjong-definition';
import { distinct, groupBy, exclude } from './utils';
import { Tile, Wind } from './definitions/tile';

export interface Hand {
    readonly concealedTiles: Tile[];
    readonly melds: Meld[];
}

export interface ReadonlyHand {
    readonly concealedTiles: readonly Tile[];
    readonly melds: readonly Meld[];
}

export function calculateWaits(hand: ReadonlyHand) {
    const possibleTiles = createDummySetOfTiles();
    // TODO: reject tiles we already hold 4 of
    // TODO: could also ignore suits that we don't have in our hand
    return possibleTiles.filter(tile => checkForMahjong(hand, tile, Wind.None, Wind.None).length);
}

// TODO: if win by ron, move the set that contains the winning tile into melds
export function checkForMahjong(hand: ReadonlyHand, winningTile: Tile, seatWind: Wind, discardWind: Wind): Mahjong[] {
    if (hand.concealedTiles.length + (hand.melds.length * 3) !== 13) {
        throw new Error('unexpected number of tiles in hand');
    }

    const selfDraw = seatWind === discardWind;

    const tiles = hand.concealedTiles.concat(winningTile).sort(sortTiles);
    const melds = hand.melds.slice() as unknown as FinalMeld[];

    const mahjong: Mahjong[] = [];

    const distinctNames = tiles.map(getTileName).filter(distinct);
    const tilesGroupedByName = Array.from(groupBy(tiles, getTileName).values());

    if (!melds.length) {
        // manual check for 13 orphans
        if (distinctNames.length === 13 && tiles.every(isTerminalOrHonor)) {
            return [{melds: [formMeld(tiles)]}];
        }
        // manual check for 7 pairs
        if (tilesGroupedByName.length === 7 && tilesGroupedByName.every(s => s.length === 2)) {
            mahjong.push({melds: [
                ...tilesGroupedByName.map(formMeld)
            ]});
            // don't return, other hands may be valid (Ryan peikou)
        }
    }

    // first take out the pairs
    const pairs = tilesGroupedByName.filter(s => s.length >= 2);
    for (const pairableTiles of pairs) {
        const pair = pairableTiles.slice(0, 2);
        const current = exclude(tiles, ...pair);

        const hands: FinalMeld[][] = [];
        walk(current, [formMeld(pair)], hands);
        mahjong.push(...hands.map(sets => ({
            melds: melds.concat(sets)
        })));
    }

    // todo, if there are other tiles with the same tile name as the winning tile in other sets, swap them around and report this as mahjong too
    return mahjong;

    function formMeld(tileSet: readonly Tile[]): FinalMeld {
        const isRon = !selfDraw && tileSet.includes(winningTile);
        return {
            kind: isRon ? FinalMeldKind.Ron : FinalMeldKind.Closed,
            from: isRon ? discardWind : seatWind,
            tiles: tileSet,
            claimedTile: isRon ? winningTile : null
        };
    }

    function walk(remainingTiles: Tile[], currentHand: FinalMeld[], hands: FinalMeld[][]) {
        if (!remainingTiles.length) {
            hands.push(currentHand);
            return;
        }

        if (remainingTiles.length % 3) {
            throw new Error('unexpected number of tiles left in hand');
        }

        const tile = remainingTiles.shift();
        const tileName = getTileName(tile);
        if (isSuited(tile) && tile.rank <= 7) {
            const tile1 = remainingTiles.find(t => getTileName(t) === tileName + 1);
            const tile2 = remainingTiles.find(t => getTileName(t) === tileName + 2);
            if (tile1 && tile2) {
                // make a run
                walk(exclude(remainingTiles, tile1, tile2),
                    currentHand.concat(formMeld([tile, tile1, tile2])),
                    hands);
            }
        }

        if (tileName === getTileName(remainingTiles[0]) && tileName === getTileName(remainingTiles[1])
            && tileName !== getTileName(remainingTiles[2]) /* don't take a pon if there are 4, we already took the chi */) {
            walk(remainingTiles.slice(2),
                currentHand.concat(formMeld([tile, remainingTiles[0], remainingTiles[1]])),
                hands);
        }
    }
}
