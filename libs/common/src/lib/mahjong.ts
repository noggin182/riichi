import { createDummySetOfTiles, tileKind, tileValue } from './utils/tile';
import { Mahjong, FinalMeld, FinalMeldKind, ReadonlyHand } from './types/hand';
import { distinct, groupBy, exclude } from './utils/array';
import { Tile, Wind } from './types/tile';
import { isTerminalOrHonor, isSuited } from './utils/tile-checks';

export function calculateWaits(hand: ReadonlyHand) {
    return getPossibleMahjongs(hand, Wind.East).map(result => result.tile);
}

export function getPossibleMahjongs(hand: ReadonlyHand, seatWind: Wind) {
    const possibleTiles = createDummySetOfTiles();
    // TODO: reject tiles we already hold 4 of
    // TODO: could also ignore suits that we don't have in our hand
    return possibleTiles.map(tile => ({
        tile: tile,
        mahjongs: checkForMahjong({
            concealedTiles: hand.concealedTiles.concat(tile),
            melds: hand.melds
        }, seatWind, seatWind),
    })).filter(result => result.mahjongs.length);
}

export function checkForMahjong(hand: ReadonlyHand, seatWind: Wind, discardWind: Wind): Mahjong[] {
    if (hand.concealedTiles.length + (hand.melds.length * 3) !== 14) {
        throw new Error('unexpected number of tiles in hand');
    }

    const selfDraw = seatWind === discardWind;
    const winningTile = hand.concealedTiles[hand.concealedTiles.length - 1];
    const tiles = hand.concealedTiles.slice().sort();
    const melds = hand.melds.slice() as unknown as FinalMeld[];

    const mahjong: Mahjong[] = [];

    const distinctTiles = tiles.filter(distinct);
    const tilesGroupedByName = Array.from(groupBy(tiles, t => t).values()); // TODO: review this

    if (!melds.length) {
        // manual check for 13 orphans
        if (distinctTiles.length === 13 && tiles.every(isTerminalOrHonor)) {
            return [{melds: [formMeld(tiles, FinalMeldKind.Orphans)], finalTile: winningTile}];
        }
        // manual check for 7 pairs
        if (tilesGroupedByName.length === 7 && tilesGroupedByName.every(s => s.length === 2)) {
            mahjong.push({
                melds: [...tilesGroupedByName.map(set => formMeld(set, FinalMeldKind.OpenPair, FinalMeldKind.ClosedPair)).sort(sortMelds(winningTile))],
                finalTile: winningTile
            });
            // don't return, other hands may be valid (Ryan peikou)
        }
    }

    // first take out the pairs
    const pairs = tilesGroupedByName.filter(s => s.length >= 2);
    for (const pairableTiles of pairs) {
        const pair = pairableTiles.slice(0, 2);
        const current = exclude(tiles, ...pair);

        const hands: FinalMeld[][] = [];
        walk(current, [formMeld(pair, FinalMeldKind.OpenPair, FinalMeldKind.ClosedPair)], hands);
        mahjong.push(...hands.map(sets => ({
            melds: melds.concat(sets).sort(sortMelds(winningTile)),
            finalTile: winningTile
        })));
    }

    // todo, if there are other tiles with the same tile name as the winning tile in other sets, swap them around and report this as mahjong too
    return mahjong;

    function formMeld(tileSet: readonly Tile[], kindIfRon: FinalMeldKind, closedKind = FinalMeldKind.ClosedSet): FinalMeld {
        const isFinal = tileSet.includes(winningTile);
        const isClaimed = !selfDraw && isFinal;
        return {
            kind: isClaimed ? kindIfRon : closedKind,
            from: isClaimed ? discardWind : seatWind,
            tiles: tileSet,
            claimedTile: isFinal ? winningTile : null,
            finalSet: isFinal
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

        const tile = remainingTiles.shift()!;
        if (isSuited(tile) && tileValue(tile) <= 7) {
            const tile1 = remainingTiles.find(t => tileKind(t) === tileKind(tile) && tileValue(t) === tileValue(tile) + 1);
            const tile2 = remainingTiles.find(t => tileKind(t) === tileKind(tile) && tileValue(t) === tileValue(tile) + 2);
            if (tile1 && tile2) {
                // make a chi
                walk(exclude(remainingTiles, tile1, tile2),
                    currentHand.concat(formMeld([tile, tile1, tile2], FinalMeldKind.OpenChi)),
                    hands);
            }
        }

        if (tile === remainingTiles[0] && tile === remainingTiles[1]
            && (!remainingTiles[2] || tile !== remainingTiles[2]) /* don't take a pon if there are 4, we already took the chi */) {
            walk(remainingTiles.slice(2),
                currentHand.concat(formMeld([tile, remainingTiles[0], remainingTiles[1]], FinalMeldKind.OpenPon)),
                hands);
        }
    }
}

function sortMelds(winningTile: Tile) {
    return function (meldA: FinalMeld, meldB: FinalMeld) {
        return (meldA.tiles.includes(winningTile) ? 100 : 0) - (meldB.tiles.includes(winningTile) ? 100 : 0)
            || (meldA.kind - meldB.kind)
            || (meldA.tiles[0].localeCompare(meldB.tiles[0]));
    };
}
