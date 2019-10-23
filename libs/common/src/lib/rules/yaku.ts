import { YakuDefinition, ExtraFan } from '../types/yaku';
import { getDoraNameFromIndicator, getTileName, allSuitsPresent } from '../utils/tile';
import { distinct } from '../utils/array';
import { Wind, TileName, TileKind } from '../types/tile';
import { areSimilarTiles, isSimple, isDragon, isHonor, isTerminalOrHonor, isTerminal, isSuited, isWind } from '../utils/tile-checks';

export const YAKUMAN_FAN = -1;

const extraIfConcealed: ExtraFan = {
    name: ['Concealed', 'Menzin'],
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

export const defaultYakuDefinitions: YakuDefinition[] = [
    // ================== 1 fan ==================
    {
        fan: 1,
        name: ['Riichi', 'Riichi'],
        description: 'Waiting hand declared at 1000 points stake',
        canBeOpen: false,
        check: hand => hand.state.riichi,
        extras: [
            {
                name: ['One Shot', 'Ippatsu'],
                description: 'Mahjong first round after declaring riichi',
                check: hand => hand.state.oneShot
            },
            {
                name: ['Double Riichi', 'Daburu Riichi'],
                description: 'Riichi declared in very first set of turns',
                check: hand => hand.state.doubleRiichi
            }
        ]
    },
    {
        fan: 1,
        name: ['Fully Concealed Hand', 'Menzen Tsumo'],
        description: 'Self-draw on a concealed hand',
        canBeOpen: false,
        check: hand => hand.selfDrawn
    },
    {
        fan: 1,
        name: ['Pinfu', 'Pinfu'],
        description: 'Four chow and valueless pair',
        canBeOpen: false,
        check: hand => hand.isPinfu
    },
    {
        fan: 1,
        name: ['Pure Double Chow', 'Iipeikou'],
        description: 'Two identical chow of the same suit',
        canBeOpen: false,
        check: hand => hand.chis.filter(t1 => hand.chis.filter(t2 => areSimilarTiles(t1, t2)).length > 1).length % 4 > 1 // length = 2 or 3. 4 would be Ryanpeikou
    },
    {
        fan: 1,
        name: ['All Simples', 'Tanyao chuu'],
        description: 'No terminals or honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isSimple)
    },
    {
        fan: 1,
        name: ['Mixed Triple Chow', 'San shoku doujun'],
        description: 'Same chow in each suit',
        canBeOpen: true,
        check: hand => hand.chis.some(t1 => allSuitsPresent(hand.chis.filter(t2 => t1.rank === t2.rank))),
        extras: [extraIfConcealed]
    },
    {
        fan: 1,
        name: ['Pure Straight', 'Itsu'],
        description: 'The three chow 1-2-3, 4-5-6 and 7-8-9, of the same suit',
        canBeOpen: true,
        extras: [extraIfConcealed],
        check: hand => hand.chis.some(t1 => t1.rank === 1
                    && hand.chis.some(t2 => t2.rank === 4 && t2.kind === t1.kind)
                    && hand.chis.some(t3 => t3.rank === 7 && t3.kind === t1.kind))
    },
    {
        fan: 1,
        name: ['Dragon Pung', 'Fanpai'],
        description: 'Pung/kong of dragons',
        canBeOpen: true,
        check: hand => hand.pons.filter(isDragon).length
    },
    {
        fan: 1,
        name: ['Seat Wind', 'Fanpai'],
        description: 'Pung/kong of seat wind',
        canBeOpen: true,
        check: hand => hand.pons.filter(hand.isSeatWind).length
    },
    {
        fan: 1,
        name: ['Prevalent Wind', 'Fanpai'],
        description: 'Pung/kong of prevalent wind',
        canBeOpen: true,
        check: hand => hand.pons.filter(hand.isPrevalentWind).length
    },
    {
        fan: 1,
        name: ['Outside Hand', 'Chanta'],
        description: 'All sets contain terminals/honours. At least one chow.',
        canBeOpen: true,
        check: hand => hand.chis.length
                    && hand.allTiles.some(isHonor) // sets containing terminals but no honors is Junchan
                    && hand.sets.every(s => isTerminalOrHonor(s[0]) || isTerminal(s[s.length - 1]))
                    && isTerminalOrHonor(hand.pairTile),
        extras: [extraIfConcealed]
    },
    {
        fan: 1,
        name: ['After a Kong', 'Rinshan kaihou'],
        description: 'Mahjong declared on a replacement tile',
        canBeOpen: true,
        check: hand => hand.state.selfDrawnAfterKan
    },
    {
        fan: 1,
        name: ['Robbing a Kong', 'Chan kan'],
        description: 'Mahjong when a pung is extended to kong',
        canBeOpen: true,
        check: hand => hand.state.robbedFromKan
    },
    {
        fan: 1,
        name: ['Bottom of the Sea', 'Haitei'],
        description: 'Mahjong on the last tile',
        canBeOpen: true,
        check: hand => hand.state.lastTile
                    && hand.selfDrawn
    },
    {
        fan: 1,
        name: ['Bottom of the Sea', 'Houtei'],
        description: 'Mahjong on the last tile following discard',
        canBeOpen: true,
        check: hand => hand.state.lastTile
                   && !hand.selfDrawn
    },

    // ================== 2 fan ==================
    {
        fan: 2,
        name: ['Seven Pair', 'Chii Toitsu'],
        description: 'No two identical pairs',
        canBeOpen: false,
        check: (hand) => hand.isSevenPairs
    },
    {
        fan: 2,
        name: ['Triple Pung', 'San shoku dokou'],
        description: 'Same pung/kong in each suit',
        canBeOpen: true,
        check: hand => hand.pons.some(t1 => allSuitsPresent(hand.pons.filter(t2 => t2.rank === t1.rank)))
    },
    {
        fan: 2,
        name: ['Three Concealed Pungs', 'San ankou'],
        description: 'Three concealed pungs/kongs and a pair',
        canBeOpen: true,
        check: hand => hand.pons.filter(s => s.concealed).length === 3
    },
    {
        fan: 2,
        name: ['Three Kongs', 'San kan tsu'],
        description: '',
        canBeOpen: true,
        check: hand => hand.pons.filter(s => s.length === 4).length === 3
    },
    {
        fan: 2,
        name: ['All Pungs', 'Toitoi hou'],
        description: 'Four pungs/kongs and a pair',
        canBeOpen: true,
        check: hand => hand.pons.length === 4
    },
    {
        fan: 2,
        name: ['Half Flush', 'Honitsu'],
        description: 'One suit including honours',
        canBeOpen: true,
        check: hand => hand.allTiles.some(isHonor)
                    && hand.allTiles.some(isSuited)
                    && hand.allTiles.filter(isSuited).map(t => t.kind).filter(distinct).length === 1,
        extras: [extraIfConcealed]
    },
    {
        fan: 2,
        name: ['Little Three Dragons', 'Shou sangen'],
        description: 'Two pungs/kongs of dragons and a pair of dragons',
        canBeOpen: true,
        check: hand => isDragon(hand.pairTile)
                    && hand.pons.filter(isDragon).length === 2
    },
    {
        fan: 2,
        name: ['All Terms and Honours', 'Honroutou'],
        description: 'All sets consist of terminals or honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isTerminalOrHonor)
    },
    {
        fan: 2,
        name: ['Terminals in All Sets', 'Junchan'],
        description: 'All sets contain terminals. At least one chow.',
        canBeOpen: true,
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
        canBeOpen: false,
        check: hand => hand.chis.filter(t1 => hand.chis.filter(t2 => areSimilarTiles(t1, t2)).length > 1).length === 4
    },

    // ================== 5 fan ==================
    {
        fan: 5,
        name: ['Full Flush', 'Chinitsu'],
        description: 'One suit, no honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(t => t.kind).filter(distinct).length === 1,
        extras: [extraIfConcealed]
    },
    {
        fan: 5, // TODO don't count other yaku
        name: ['Blessing of Man', 'Renho'],
        description: 'Mahjong on discard in the first round',
        canBeOpen: false,
        check: hand => hand.state.firstRound && !hand.selfDrawn
    },

    // ================== Yakuman ==================
    {
        fan: YAKUMAN_FAN,
        name: ['Thirteen Orphans', 'Kokushi musou'],
        description: 'One of each honour and terminal and one duplicate',
        canBeOpen: false,
        check: (hand) => hand.isThirteenOrphans
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Nine Gates', 'Chuuren pooto'],
        description: '1112345678999 + one duplicate of the same suit',
        canBeOpen: false,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(t => t.kind).filter(distinct).length === 1
                    && [1, 2, 3, 4, 5, 6, 7, 8, 9].every(v => hand.allTiles.some(t => t.rank === v))
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Blessing of Heaven', 'Tenho'],
        description: 'East mahjong on initial fourteen tiles',
        canBeOpen: false,
        check: hand => hand.state.firstRound
                    && hand.selfDrawn
                    && hand.state.seatWind === Wind.East
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Blessing of Earth', 'Chiho'],
        description: 'Mahjong on self-draw in the first round',
        canBeOpen: false,
        check: hand => hand.state.firstRound
                    && hand.selfDrawn
                    && hand.state.seatWind !== Wind.East
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Four Concealed Pungs', 'Suu ankou'],
        description: 'Four concealed pungs/kongs and a pair',
        canBeOpen: false,
        check: hand => hand.pons.length === 4
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Four Kongs', 'Suu kan tsu'],
        description: 'Four kongs and a pair',
        canBeOpen: true,
        check: hand => hand.pons.filter(s => s.length === 4).length === 4
    },
    {
        fan: YAKUMAN_FAN,
        name: ['All Green', 'Ryuu iisou'],
        description: 'Hand of green tiles: bamboo 2, 3, 4, 6, 8 and green dragon',
        canBeOpen: true,
        check: hand => hand.allTiles.every(t => getTileName(t) === TileName.Hatsu || (t.kind === TileKind.Sou && [2, 3, 4, 6, 8].includes(t.rank)))
    },
    {
        fan: YAKUMAN_FAN,
        name: ['All Terminals', 'Chinrouto'],
        description: 'All sets consist of terminals',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isTerminal)
    },
    {
        fan: YAKUMAN_FAN,
        name: ['All Honours', 'Tsuu iisou'],
        description: 'All sets consist of honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isHonor)
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Big Three Dragons', 'Dai sangen'],
        description: 'Three pungs/kongs of dragons',
        canBeOpen: true,
        check: hand => hand.pons.filter(isDragon).length === 3
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Little Four Winds', 'Shou suushii'],
        description: 'Three pungs/kongs of winds and a pair of winds',
        canBeOpen: true,
        check: hand => hand.pons.filter(isWind).length === 3
                    && isWind(hand.pairTile)
    },
    {
        fan: YAKUMAN_FAN,
        name: ['Big Four Winds', 'Dai suushii'],
        description: 'Four pungs/kongs of winds',
        canBeOpen: true,
        check: hand => hand.pons.filter(isWind).length === 4
    },

    // ================== 0 fan ==================
    // "Zero fan" yakus are yaku like rules that don't give a yaku.
    // They are marked as zero to indicate they are not yaku but will be counted as 1 fan
    {
        fan: 0,
        name: ['Dora', 'Dora'],
        description: 'Extra fan for dora',
        canBeOpen: true,
        check: hand => hand.state.doraIndicator.map(getDoraNameFromIndicator).reduce((total, doraName) => total + hand.allTiles.filter(t => getTileName(t) === doraName).length, 0)
    },
    {
        fan: 0,
        name: ['Ura dora', 'Ura dora'],
        description: 'Extra fan for ura dora',
        canBeOpen: true,
        check: hand => hand.state.uraDoraIndicator.map(getDoraNameFromIndicator).reduce((total, doraName) => total + hand.allTiles.filter(t => getTileName(t) === doraName).length, 0)
    }
];
