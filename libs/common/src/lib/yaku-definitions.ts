import { ConcealedType, YakuDefinition, ExtraFan } from './yaku.def';
import { isHonor, getSuitFromTile, getValueFromTile, isSimple, isTerminalOrHonor, isSuited, isTerminal, getDoraFromIndicator } from './tile-utils';
import { TileSuit, Wind, Tile } from './definitions/tiles';

export const YAKUMAN_FAN = -1;

export const doraYaku: YakuDefinition[] = [
    {
        fan: 1,
        name: ['Dora', 'Dora'],
        description: 'Extra fan for dora',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.doraIndicator.map(getDoraFromIndicator).reduce((total, tile) => total + hand.allTiles.filter(t => t === tile).length, 0)
    }
];

const extraIfConcealed: ExtraFan = {
    name: ['Concealed hand', 'Concealed hand'],
    description: 'Extra fan for concealed',
    check: hand => hand.mahjong.melds.length === 0
};

/*
  IMPORTANT!
  Things to consider when writing conditions.
  The conditions must handle 7 pairs and 13 orphans as well.
  hand.pairTile may be blank, and hand.mahjong.pair null
  Calling every on an empty array returns true!

*/

export const yakuDefinitions: YakuDefinition[] = [
    // ================== 1 fan ==================
    {
        fan: 1,
        name: ['Riichi', 'Riichi'],
        description: 'Waiting hand declared at 1000 points stake',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.riichi,
        extras: [
            {
                name: ['One Shot', 'Ippatsu'],
                description: 'Mahjong first round after declaring riichi',
                check: hand => hand.oneShot
            },
            {
                name: ['Double Riichi', 'Daburu Riichi'],
                description: 'Riichi declared in very first set of turns',
                check: hand => hand.doubleRiichi
            }
        ]
    },
    {
        fan: 1,
        name: ['Fully Concealed Hand', 'Menzen Tsumo'],
        description: 'Self-draw on a concealed hand',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.selfDrawn
    },
    {
        fan: 1,
        name: ['Pinfu', 'Pinfu'],
        description: 'Four chow and valueless pair',
        style: ConcealedType.MustBeConcealed,
        check: hand => !hand.pons.length
                    && hand.chis.some(s => (s[0] === hand.winningTile && getValueFromTile(s[2]) !== 7)
                                        || (s[2] === hand.winningTile && getValueFromTile(s[0]) !== 3))
                    && getSuitFromTile(hand.pairTile) !== TileSuit.Dragon
                    && hand.pairTile !== hand.prevailingWindTile
                    && hand.pairTile !== hand.seatedWindTile
    },
    {
        fan: 1,
        name: ['Pure Double Chow', 'Iipeikou'],
        description: 'Two identical chow of the same suit',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.chis.filter(s1 => hand.chis.filter(s2 => s1[0] === s2[0]).length > 1).length % 4 > 1 // length = 2 or 3. 4 would be Ryanpeikou
    },
    {
        fan: 1,
        name: ['All Simples', 'Tanyao chuu'],
        description: 'No terminals or honours',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.allTiles.every(isSimple)
    },
    {
        fan: 1,
        name: ['Mixed Triple Chow', 'San shoku doujun'],
        description: 'Same chow in each suit',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.chis.some(s => allSuits(hand.chis.filter(s2 => sameValue(s, s2)))),
        extras: [extraIfConcealed]
    },
    {
        fan: 1,
        name: ['Pure Straight', 'Itsu'],
        description: 'The three chow 1-2-3, 4-5-6 and 7-8-9, of the same suit',
        style: ConcealedType.CanBeOpen,
        extras: [extraIfConcealed],
        check: hand => hand.chis.some(s => getValueFromTile(s[0]) === 1
                                        && hand.chis.some(s2 => sameSuit(s, s2) && getValueFromTile(s2[0]) === 4)
                                        && hand.chis.some(s3 => sameSuit(s, s3) && getValueFromTile(s3[0]) === 7))
    },
    {
        fan: 1,
        name: ['Dragon Pung', 'Fanpai'],
        description: 'Pung/kong of dragons',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.pons.filter(s => getSuitFromTile(s[0]) === TileSuit.Dragon).length
    },
    {
        fan: 1,
        name: ['Seat Wind', 'Fanpai'],
        description: 'Pung/kong of seat wind',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.pons.filter(s => s[0] === hand.seatedWindTile).length
    },
    {
        fan: 1,
        name: ['Prevalent Wind', 'Fanpai'],
        description: 'Pung/kong of prevalent wind',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.pons.filter(s => s[0] === hand.prevailingWindTile).length
    },
    {
        fan: 1,
        name: ['Outside Hand', 'Chanta'],
        description: 'All sets contain terminals/honours. At least one chow.',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.chis.length
                    && hand.allTiles.some(isHonor) // no honors is Junchan
                    && hand.sets.every(s => isTerminalOrHonor(s[0]) || isTerminal(s[s.length - 1]))
                    && isTerminalOrHonor(hand.pairTile),
        extras: [extraIfConcealed]
    },
    {
        fan: 1,
        name: ['After a Kong', 'Rinshan kaihou'],
        description: 'Mahjong declared on a replacement tile',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.selfDrawnAfterKan
    },
    {
        fan: 1,
        name: ['Robbing a Kong', 'Chan kan'],
        description: 'Mahjong when a pung is extended to kong',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.robbedFromKan
    },
    {
        fan: 1,
        name: ['Bottom of the Sea', 'Haitei'],
        description: 'Mahjong on the last tile',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.lastTile
                    && hand.selfDrawn
    },
    {
        fan: 1,
        name: ['Bottom of the Sea', 'Houtei'],
        description: 'Mahjong on the last tile following discard',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.lastTile
                   && !hand.selfDrawn
    },

    // ================== 2 fan ==================
    {
        fan: 2,
        name: ['Seven Pair', 'Chii Toitsu'],
        description: 'No two identical pairs',
        style: ConcealedType.MustBeConcealed,
        check: (hand) => hand.isSevenPairs
    },
    {
        fan: 2,
        name: ['Triple Pung', 'San shoku dokou'],
        description: 'Same pung/kong in each suit',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.pons.some(s => allSuits(hand.pons.filter(s2 => sameValue(s, s2))))
    },
    {
        fan: 2,
        name: ['Three Concealed Pungs', 'San ankou'],
        description: 'Three concealed pungs/kongs and a pair',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.mahjong.concealed.filter(isPonOrKan).length === 3
        // TODO: set isn't concealed if it's completed by ron!
        // http://arcturus.su/wiki/Sanankou
    },
    {
        fan: 2,
        name: ['Three Kongs', 'San kan tsu'],
        description: '',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.pons.filter(isKan).length === 3
    },
    {
        fan: 2,
        name: ['All Pungs', 'Toitoi hou'],
        description: 'Four pungs/kongs and a pair',
        style: ConcealedType.MustBeOpen,
        check: hand => hand.pons.length === 4
    },
    {
        fan: 2,
        name: ['Half Flush', 'Honitsu'],
        description: 'One suit including honours',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.allTiles.some(isHonor)
                    && hand.allTiles.some(isSuited)
                    && hand.allTiles.filter(t => !isHonor(t)).map(getSuitFromTile).filter(distinct).length === 1,
        extras: [extraIfConcealed]
    },
    {
        fan: 2,
        name: ['Little Three Dragons', 'Shou sangen'],
        description: 'Two pungs/kongs of dragons and a pair of dragons',
        style: ConcealedType.CanBeOpen,
        check: hand => getSuitFromTile(hand.pairTile) === TileSuit.Dragon
                    && hand.pons.filter(s => getSuitFromTile(s[0]) === TileSuit.Dragon).length === 2
    },
    {
        fan: 2,
        name: ['All Terms and Honours', 'Honroutou'],
        description: 'All sets consist of terminals or honours',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.allTiles.every(isTerminalOrHonor)
    },
    {
        fan: 2,
        name: ['Terminals in All Sets', 'Junchan'],
        description: 'All sets contain terminals. At least one chow.',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.chis.length
                    && hand.allTiles.every(isSuited) // anything with an honour is Chanta
                    && isTerminal(hand.pairTile)
                    && hand.sets.every(s => isTerminal(s[0]) || isTerminal(s[2])),
        extras: [extraIfConcealed]
    },

    // ================== 3 fan ==================
    {
        fan: 3,
        name: ['Twice Pure Double Chow', 'Ryan peikou'],
        description: 'Two times two identical chow and a pair',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.chis.filter(s1 => hand.chis.filter(s2 => s1[0] === s2[0]).length > 1).length === 4
    },

    // ================== 5 fan ==================
    {
        fan: 5,
        name: ['Full Flush', 'Chinitsu'],
        description: 'One suit, no honours',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(getSuitFromTile).filter(distinct).length === 1,
        extras: [extraIfConcealed]
    },
    {
        fan: 5, // TODO don't count other yaku
        name: ['Blessing of Man', 'Renho'],
        description: 'Mahjong on discard in the first round',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.firstRound && !hand.selfDrawn
    },

    // ================== Yakuman ==================
    {
        fan: YAKUMAN_FAN,
        name: ['Thirteen Orphans', 'Kokushi musou'],
        description: 'One of each honour and terminal and one duplicate',
        style: ConcealedType.MustBeConcealed,
        check: (hand) => hand.isThirteenOrphans
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Nine Gates', 'Chuuren pooto'],
        description: '1112345678999 + one duplicate of the same suit',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(getSuitFromTile).filter(distinct).length === 1
                    && [1, 2, 3, 4, 5, 6, 7, 8, 9].every(v => hand.allTiles.some(t => getValueFromTile(t) === v))
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Blessing of Heaven', 'Tenho'],
        description: 'East mahjong on initial fourteen tiles',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.firstRound
                    && hand.selfDrawn
                    && hand.seatedWind === Wind.East
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Blessing of Earth', 'Chiho'],
        description: 'Mahjong on self-draw in the first round',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.firstRound
                    && hand.selfDrawn
                    && hand.seatedWind !== Wind.East
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Four Concealed Pungs', 'Suu ankou'],
        description: 'Four concealed pungs/kongs and a pair',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.mahjong.concealed.filter(isPonOrKan).length === 4
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Four Kongs', 'Suu kan tsu'],
        description: 'Four kongs and a pair',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.sets.filter(isKan).length === 4
    },
    {
        fan: YAKUMAN_FAN,
        name: ['All Green', 'Ryuu iisou'],
        description: 'Hand of green tiles: bamboo 2, 3, 4, 6, 8 and green dragon',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.allTiles.every(t => t === Tile.Hatsu || (getSuitFromTile(t) === TileSuit.Sou && [2, 3, 4, 6, 8].includes(getValueFromTile(t))))
    },
    {
        fan: YAKUMAN_FAN,
        name: ['All Terminals', 'Chinrouto'],
        description: 'All sets consist of terminals',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.allTiles.every(isTerminal)
    },
    {
        fan: YAKUMAN_FAN,
        name: ['All Honours', 'Tsuu iisou'],
        description: 'All sets consist of honours',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.allTiles.every(isHonor)
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Big Three Dragons', 'Dai sangen'],
        description: 'Three pungs/kongs of dragons',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.pons.filter(s => getSuitFromTile(s[0]) === TileSuit.Dragon).length === 3
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Little Four Winds', 'Shou suushii'],
        description: 'Three pungs/kongs of winds and a pair of winds',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.pons.filter(s => getSuitFromTile(s[0]) === TileSuit.Wind).length === 3
                    && getSuitFromTile(hand.pairTile) === TileSuit.Wind
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Big Four Winds', 'Dai suushii'],
        description: 'Four pungs/kongs of winds',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.pons.filter(s => getSuitFromTile(s[0]) === TileSuit.Wind).length === 4
    }
];

export function isPon(set: Tile[]) {
    return set.length === 3 && set[0] === set[1];
}

export function isKan(set: Tile[]) {
    return set.length === 4;
}

export function isPonOrKan(set: Tile[]) {
    return isPon(set) || isKan(set);
}

export function isChi(set: Tile[]) {
    return set[0] !== set[1];
}

export function distinct<T>(item: T, index: number, array: T[]) {
    return array.indexOf(item) === index;
}

export function allSuits(sets: Tile[][]) {
    const suits = sets.map(s => getSuitFromTile(s[0]));
    return suits.includes(TileSuit.Man)
        && suits.includes(TileSuit.Sou)
        && suits.includes(TileSuit.Pin);
}

export function sameValue(set1: Tile[], set2: Tile[]) {
    return getValueFromTile(set1[0]) === getValueFromTile(set2[0]);
}

export function sameSuit(set1: Tile[], set2: Tile[]) {
    return getSuitFromTile(set1[0]) === getSuitFromTile(set2[0]);
}
