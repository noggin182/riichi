import { ConcealedType, YakuDefinition, ExtraFan } from './yaku.def';
import { isHonor, isTerminalOrHonor, isSuited, getDoraNameFromIndicator, getTileName, areSimilarTiles, isSimple, allSuitsPresent, isDragon, isTerminal, isPonOrKan, isKan, isWind } from './tile-utils';
import { distinct } from './utils';
import { Wind, TileName, TileKind } from './definitions/tile';

export const YAKUMAN_FAN = -1;

export const doraYaku: YakuDefinition[] = [
    {
        fan: 1,
        name: ['Dora', 'Dora'],
        description: 'Extra fan for dora',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.doraIndicator.map(getDoraNameFromIndicator).reduce((total, doraName) => total + hand.allTiles.filter(t => getTileName(t) === doraName).length, 0)
    },
    {
        fan: 1,
        name: ['Ura dora', 'Ura dora'],
        description: 'Extra fan for ura dora',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.uraDoraIndicator.map(getDoraNameFromIndicator).reduce((total, doraName) => total + hand.allTiles.filter(t => getTileName(t) === doraName).length, 0)
    }
];

const extraIfConcealed: ExtraFan = {
    name: ['Concealed hand', 'Concealed hand'],
    description: 'Extra fan for concealed',
    check: hand => !hand.isOpen
};

/*
  IMPORTANT!
  Things to consider when writing conditions.
  The conditions must handle 7 pairs and 13 orphans as well
    This is helped by the isSevenPairs and isThirteenOrphans flags, in both cases all sets are empty
  hand.pairTile, hand.pair[0] and hand.pair[1] may all be  blank
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
        check: hand => hand.isPinfu
    },
    {
        fan: 1,
        name: ['Pure Double Chow', 'Iipeikou'],
        description: 'Two identical chow of the same suit',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.flatChis.filter(t1 => hand.flatChis.filter(t2 => areSimilarTiles(t1, t2)).length > 1).length % 4 > 1 // length = 2 or 3. 4 would be Ryanpeikou
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
        check: hand => hand.flatChis.some(t1 => allSuitsPresent(hand.flatChis.filter(t2 => t1.rank === t2.rank))),
        extras: [extraIfConcealed]
    },
    {
        fan: 1,
        name: ['Pure Straight', 'Itsu'],
        description: 'The three chow 1-2-3, 4-5-6 and 7-8-9, of the same suit',
        style: ConcealedType.CanBeOpen,
        extras: [extraIfConcealed],
        check: hand => hand.flatChis.some(t1 => t1.rank === 1
                    && hand.flatChis.some(t2 => t2.rank === 4 && t2.kind === t1.kind)
                    && hand.flatChis.some(t3 => t3.rank === 7 && t3.kind === t1.kind))
    },
    {
        fan: 1,
        name: ['Dragon Pung', 'Fanpai'],
        description: 'Pung/kong of dragons',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.flatPons.filter(isDragon).length
    },
    {
        fan: 1,
        name: ['Seat Wind', 'Fanpai'],
        description: 'Pung/kong of seat wind',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.flatPons.filter(hand.isSeatWind).length
    },
    {
        fan: 1,
        name: ['Prevalent Wind', 'Fanpai'],
        description: 'Pung/kong of prevalent wind',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.flatPons.filter(hand.isPrevalentWind).length
    },
    {
        fan: 1,
        name: ['Outside Hand', 'Chanta'],
        description: 'All sets contain terminals/honours. At least one chow.',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.chis.length
                    && hand.allTiles.some(isHonor) // sets containing terminals but no honors is Junchan
                    && hand.sets.every(s => isTerminalOrHonor(s[0]) || isTerminal(s[s.length - 1]))
                    && isTerminalOrHonor(hand.pair[0]),
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
        check: hand => hand.flatPons.some(t1 => allSuitsPresent(hand.flatPons.filter(t2 => t2.rank === t1.rank)))
    },
    {
        fan: 2,
        name: ['Three Concealed Pungs', 'San ankou'],
        description: 'Three concealed pungs/kongs and a pair',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.concealed.filter(isPonOrKan).length === 3
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
                    && hand.allTiles.filter(isSuited).map(t => t.kind).filter(distinct).length === 1,
        extras: [extraIfConcealed]
    },
    {
        fan: 2,
        name: ['Little Three Dragons', 'Shou sangen'],
        description: 'Two pungs/kongs of dragons and a pair of dragons',
        style: ConcealedType.CanBeOpen,
        check: hand => isDragon(hand.pair[0])
                    && hand.flatPons.filter(isDragon).length === 2
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
                    && isTerminal(hand.pair[0])
                    && hand.sets.every(s => isTerminal(s[0]) || isTerminal(s[2])),
        extras: [extraIfConcealed]
    },

    // ================== 3 fan ==================
    {
        fan: 3,
        name: ['Twice Pure Double Chow', 'Ryan peikou'],
        description: 'Two times two identical chow and a pair',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.flatChis.filter(t1 => hand.flatChis.filter(t2 => areSimilarTiles(t1, t2)).length > 1).length === 4
    },

    // ================== 5 fan ==================
    {
        fan: 5,
        name: ['Full Flush', 'Chinitsu'],
        description: 'One suit, no honours',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(t => t.kind).filter(distinct).length === 1,
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
                    && hand.allTiles.map(t => t.kind).filter(distinct).length === 1
                    && [1, 2, 3, 4, 5, 6, 7, 8, 9].every(v => hand.allTiles.some(t => t.rank === v))
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Blessing of Heaven', 'Tenho'],
        description: 'East mahjong on initial fourteen tiles',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.firstRound
                    && hand.selfDrawn
                    && hand.seatWind === Wind.East
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Blessing of Earth', 'Chiho'],
        description: 'Mahjong on self-draw in the first round',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.firstRound
                    && hand.selfDrawn
                    && hand.seatWind !== Wind.East
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Four Concealed Pungs', 'Suu ankou'],
        description: 'Four concealed pungs/kongs and a pair',
        style: ConcealedType.MustBeConcealed,
        check: hand => hand.concealed.filter(isPonOrKan).length === 4
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
        check: hand => hand.allTiles.every(t => getTileName(t) === TileName.Hatsu || (t.kind === TileKind.Sou && [2, 3, 4, 6, 8].includes(t.rank)))
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
        check: hand => hand.flatPons.filter(isDragon).length === 3
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Little Four Winds', 'Shou suushii'],
        description: 'Three pungs/kongs of winds and a pair of winds',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.flatPons.filter(isWind).length === 3
                    && isWind(hand.pair[0])
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Big Four Winds', 'Dai suushii'],
        description: 'Four pungs/kongs of winds',
        style: ConcealedType.CanBeOpen,
        check: hand => hand.flatPons.filter(isWind).length === 4
    }
];
