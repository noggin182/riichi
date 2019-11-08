import { ExtraFan, YakuCollection } from '../types/yaku';
import { getDoraNameFromIndicator, getTileName, allSuitsPresent } from '../utils/tile';
import { distinct } from '../utils/array';
import { Wind, TileName, TileKind } from '../types/tile';
import { areSimilarTiles, isSimple, isDragon, isHonor, isTerminalOrHonor, isTerminal, isSuited, isWind } from '../utils/tile-checks';

export const YAKUMAN_FAN = -1;

const extraIfConcealed = {
    'MEN' : {
        name: ['Concealed', 'Menzin'],
        description: 'Extra fan for concealed',
        check: hand => !hand.isOpen
    } as ExtraFan
};

/*
  IMPORTANT!
  Things to consider when writing conditions.
  The conditions must handle 7 pairs and 13 orphans as well
    This is helped by the isSevenPairs and isThirteenOrphans flags, in both cases all sets are empty
  hand.pairTile, hand.pair[0] and hand.pair[1] may all be  blank
  Calling every on an empty array returns true!

*/

export const defaultYakuCollection: YakuCollection = {
    // ================== 1 fan ==================
    'RCH': {
        han: 1,
        name: ['Ready hand', 'Riichi', '立直'],
        description: 'Waiting hand declared at 1000 points stake',
        canBeOpen: false,
        check: hand => hand.state.riichi,
        extras: {
            'IPP': {
                name: ['One-shot', 'Ippatsu', '一発'],
                description: 'Mahjong first round after declaring riichi',
                check: hand => hand.state.oneShot
            },
            'DRI': {
                name: ['Double-ready', 'Daburu riichi', 'ダブルリーチ'],
                description: 'Ready declared in very first set of turns',
                check: hand => hand.state.doubleRiichi
            }
        }
    },
    'SMO': {
        han: 1,
        name: ['Self-pick', 'Menzenchin tsumohou', '門前清自摸和'],
        description: 'Self-draw on a concealed hand',
        canBeOpen: false,
        check: hand => hand.selfDrawn
    },
    'PFU': {
        han: 1,
        name: ['No-points hand', 'Pinfu', '平和'],
        description: 'Four chi and valueless pair',
        canBeOpen: false,
        check: hand => hand.isPinfu
    },
    'IPK': {
        han: 1,
        name: ['One set of identical sequences', 'Iipeikou', '一盃口'],
        description: 'Two identical chi of the same suit',
        canBeOpen: false,
        check: hand => hand.chis.filter(t1 => hand.chis.filter(t2 => areSimilarTiles(t1, t2)).length > 1).length % 4 > 1 // length = 2 or 3. 4 would be Ryanpeikou
    },
    'TAN': {
        han: 1,
        name: ['All simples', 'Tanyao', ' 断么九'],
        description: 'No terminals or honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isSimple)
    },
    'SDJ': {
        han: 1,
        name: ['Three colour straight', 'Sanshoku doujun', '三色同順'],
        description: 'Three sequences of the same numbers in all three suits',
        canBeOpen: true,
        check: hand => hand.chis.some(t1 => allSuitsPresent(hand.chis.filter(t2 => t1.rank === t2.rank))),
        extras: extraIfConcealed
    },
    'ITT': {
        han: 1,
        name: ['Straight', 'Ittsuu', '一気通貫'],
        description: 'Sequences of 1-2-3, 4-5-6 and 7-8-9 all in the same suit',
        canBeOpen: true,
        extras: extraIfConcealed,
        check: hand => hand.chis.some(t1 => t1.rank === 1
                                         && hand.chis.some(t2 => t2.rank === 4 && t2.kind === t1.kind)
                                         && hand.chis.some(t3 => t3.rank === 7 && t3.kind === t1.kind))
    },
    'YAK': {
        han: 1,
        name: ['Honor tiles', 'Yakuhai', '役牌'],
        description: 'Any triplets or quads of dragons, the player\'s wind and the prevailing wind. If a wind is both the player\'s wind and the prevailing wind, it is worth two han per group.',
        canBeOpen: true,
        check: hand => hand.pons.filter(isDragon).length
                     + hand.pons.filter(hand.isSeatWind).length
                     + hand.pons.filter(hand.isPrevalentWind).length
    },
    'CHA': {
        han: 1,
        name: ['Terminal or honor in each set', 'Chantaiyao', '全帯幺九'],
        description: 'The sequences in the hand must be 1-2-3 and 7-8-9, and triplets and the pair must be 1\'s, 9\'s and honor tiles. The hand contains at least one sequence.',
        canBeOpen: true,
        check: hand => hand.chis.length
                    && hand.allTiles.some(isHonor) // sets containing terminals but no honors is Junchan
                    && hand.sets.every(s => isTerminalOrHonor(s) || isTerminal(s[s.length - 1]))
                    && isTerminalOrHonor(hand.pair),
        extras: extraIfConcealed
    },
    'RIN': {
        han: 1,
        name: ['Dead wall draw', 'Rinshan kaihou', '嶺上開花'],
        description: 'Mahjong declared on a replacement tile',
        canBeOpen: true,
        check: hand => hand.state.selfDrawnAfterKan
    },
    'CHK': {
        han: 1,
        name: ['Robbing a quad', 'Chankan', '搶槓'],
        description: 'Mahjong when a pon is extended to kan',
        canBeOpen: true,
        check: hand => hand.state.robbedFromKan
    },
    'HAI': {
        han: 1,
        name: ['Last tile from the wall', 'Haitei raoyue', '海底撈月'],
        description: 'Mahjong on the last tile',
        canBeOpen: true,
        check: hand => hand.state.lastTile
                    && hand.selfDrawn
    },
    'HOU': {
        han: 1,
        name: ['Last discard', 'Houtei raoyui', '河底撈魚'],
        description: 'Mahjong on the last tile following discard',
        canBeOpen: true,
        check: hand => hand.state.lastTile
                   && !hand.selfDrawn
    },

    // ================== 2 fan ==================
    'CHI': {
        han: 2,
        name: ['Seven pairs', 'Chiitoitsu', '七対子'],
        description: 'No two identical pairs',
        canBeOpen: false,
        check: (hand) => hand.isSevenPairs
    },
    'SDO': {
        han: 2,
        name: ['Three colour triplets', 'Sanshoku doujkou', '三色同刻'],
        description: 'Same pon/kan in each suit',
        canBeOpen: true,
        check: hand => hand.pons.some(t1 => allSuitsPresent(hand.pons.filter(t2 => t2.rank === t1.rank)))
    },
    'SNA': {
        han: 2,
        name: ['Three closed triplets', 'Sanankou', '三暗刻'],
        description: 'Three concealed pon/kan and a pair',
        canBeOpen: true,
        check: hand => hand.pons.filter(s => s.concealed).length === 3
    },
    'SNK': {
        han: 2,
        name: ['Three Kongs', 'Sankantsu', '三色同刻]'],
        description: '',
        canBeOpen: true,
        check: hand => hand.pons.filter(s => s.length === 4).length === 3
    },
    'TOI': {
        han: 2,
        name: ['All Pon', 'Toitoi', '対々'],
        description: 'Four pon/kan and a pair',
        canBeOpen: true,
        check: hand => hand.pons.length === 4
    },
    'HON': {
        han: 2,
        name: ['Half Flush', 'Honitsu', '混一色'],
        description: 'One suit including honours',
        canBeOpen: true,
        check: hand => hand.allTiles.some(isHonor)
                    && hand.allTiles.some(isSuited)
                    && hand.allTiles.filter(isSuited).map(t => t.kind).filter(distinct).length === 1,
        extras: extraIfConcealed
    },
    'SSG': {
        han: 2,
        name: ['Little Three Dragons', 'Shousangen', '小三元'],
        description: 'Two pon/kan of dragons and a pair of dragons',
        canBeOpen: true,
        check: hand => isDragon(hand.pair)
                    && hand.pons.filter(isDragon).length === 2
    },
    'HRO': {
        han: 2,
        name: ['All Terms and Honours', 'Honroutou', '混老頭'],
        description: 'All sets consist of terminals or honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isTerminalOrHonor)
    },
    'JUN': {
        han: 2,
        name: ['Terminals in All Sets', 'Junchan taiyao', '純全帯么'],
        description: 'All sets contain terminals. At least one chow.',
        canBeOpen: true,
        check: hand => hand.chis.length
                    && hand.allTiles.every(isSuited) // anything with an honour is Chanta
                    && isTerminal(hand.pair)
                    && hand.sets.every(s => isTerminal(s[0]) || isTerminal(s[2])),
        extras: extraIfConcealed
    },

    // ================== 3 fan ==================
    'RPK': {
        han: 3,
        name: ['Twice Pure Double Chow', 'Ryanpeikou', '二盃口'],
        description: 'Two times two identical chow and a pair',
        canBeOpen: false,
        check: hand => hand.chis.filter(t1 => hand.chis.filter(t2 => areSimilarTiles(t1, t2)).length > 1).length === 4
    },

    // ================== 5 fan ==================
    'CHN': {
        han: 5,
        name: ['Full Flush', 'Chinitsu', '清一色'],
        description: 'One suit, no honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(t => t.kind).filter(distinct).length === 1,
        extras: extraIfConcealed
    },
    'REN': {
        han: 5, // TODO don't count other yaku
        name: ['Blessing of Man', 'Renho'],
        description: 'Mahjong on discard in the first round',
        canBeOpen: false,
        check: hand => hand.state.firstRound && !hand.selfDrawn
    },

    // ================== Yakuman ==================
    'KMU': {
        han: YAKUMAN_FAN,
        name: ['Thirteen Orphans', 'Kokushi musou', '国士無双'],
        description: 'One of each honour and terminal and one duplicate',
        canBeOpen: false,
        check: (hand) => hand.isThirteenOrphans
    },
    'CHU': {
        han: YAKUMAN_FAN,
        name: ['Nine Gates', 'Chuuren poutou', '九連宝燈'],
        description: '1112345678999 + one duplicate of the same suit',
        canBeOpen: false,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(t => t.kind).filter(distinct).length === 1
                    && [1, 2, 3, 4, 5, 6, 7, 8, 9].every(v => hand.allTiles.some(t => t.rank === v))
    },
    'TEN': {
        han: YAKUMAN_FAN,
        name: ['Blessing of Heaven', 'Tenho', '天和'],
        description: 'East mahjong on initial fourteen tiles',
        canBeOpen: false,
        check: hand => hand.state.firstRound
                    && hand.selfDrawn
                    && hand.state.seatWind === Wind.East
    },
    'CHH': {
        han: YAKUMAN_FAN,
        name: ['Blessing of Earth', 'Chiihou', '地和'],
        description: 'Mahjong on self-draw in the first round',
        canBeOpen: false,
        check: hand => hand.state.firstRound
                    && hand.selfDrawn
                    && hand.state.seatWind !== Wind.East
    },
    'SUA': {
        han: YAKUMAN_FAN,
        name: ['Four Concealed Pon', 'Suuankou', '四暗刻'],
        description: 'Four concealed pon/kan and a pair',
        canBeOpen: false,
        check: hand => hand.pons.filter(s => s.concealed).length === 4
    },
    'SUK': {
        han: YAKUMAN_FAN,
        name: ['Four Kongs', 'Suukantsu', '四槓子'],
        description: 'Four kan and a pair',
        canBeOpen: true,
        check: hand => hand.pons.filter(s => s.length === 4).length === 4
    },
    'RYU': {
        han: YAKUMAN_FAN,
        name: ['All Green', 'Ryuuiisou', '緑一色'],
        description: 'Hand of green tiles: bamboo 2, 3, 4, 6, 8 and green dragon',
        canBeOpen: true,
        check: hand => hand.allTiles.every(t => getTileName(t) === TileName.Hatsu || (t.kind === TileKind.Sou && [2, 3, 4, 6, 8].includes(t.rank)))
    },
    'CHR': {
        han: YAKUMAN_FAN,
        name: ['All Terminals', 'Chinroutou', '清老頭'],
        description: 'All sets consist of terminals',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isTerminal)
    },
    'TSU': {
        han: YAKUMAN_FAN,
        name: ['All Honours', 'Tsuuiisou', '字一色'],
        description: 'All sets consist of honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isHonor)
    },
    'DSG': {
        han: YAKUMAN_FAN,
        name: ['Big Three Dragons', 'Daisangen', '大三元'],
        description: 'Three pungs/kongs of dragons',
        canBeOpen: true,
        check: hand => hand.pons.filter(isDragon).length === 3
    },
    'SSS': {
        han: YAKUMAN_FAN,
        name: ['Little Four Winds', 'Shousuushii', '小四喜'],
        description: 'Three pungs/kongs of winds and a pair of winds',
        canBeOpen: true,
        check: hand => hand.pons.filter(isWind).length === 3
                    && isWind(hand.pair)
    },
    'DSS': {
        han: YAKUMAN_FAN,
        name: ['Big Four Winds', 'Daisuushii', '大四喜'],
        description: 'Four pungs/kongs of winds',
        canBeOpen: true,
        check: hand => hand.pons.filter(isWind).length === 4
    },

    // ================== 0 fan ==================
    // "Zero fan" yakus are yaku like rules that don't give a yaku.
    // Although they are marked as zero to indicate they are not yaku, they will be counted as 1 fan as long as there is a valid yaku
    'DOR': {
        han: 0,
        name: ['Dora', 'Dora', 'ドラ'],
        description: 'Extra fan for dora',
        canBeOpen: true,
        check: hand => hand.state.doraIndicator.map(getDoraNameFromIndicator).reduce((total, doraName) => total + hand.allTiles.filter(t => getTileName(t) === doraName).length, 0)
    },
    'URA': {
        han: 0,
        name: ['Underneath dora', 'Uradora', '裏ドラ'],
        description: 'Extra fan for uradora',
        canBeOpen: true,
        check: hand => hand.state.riichi && hand.state.uraDoraIndicator.map(getDoraNameFromIndicator).reduce((total, doraName) => total + hand.allTiles.filter(t => getTileName(t) === doraName).length, 0)
    }
};
