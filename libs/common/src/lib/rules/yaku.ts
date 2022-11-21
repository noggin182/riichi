import { ExtraHan, YakuCollection } from '../types/yaku';
import { getDoraFromIndicator, allSuitsPresent, tileRank, tileKind } from '../utils/tile';
import { distinct } from '../utils/array';
import { Wind, TileKind, Dragon } from '../types/tile';
import { areSimilarTiles, isSimple, isDragon, isHonor, isTerminalOrHonor, isTerminal, isSuited, isWind } from '../utils/tile-checks';

export const YAKUMAN_HAN = -1;

const extraIfConcealed = {
    'MEN' : {
        name: ['Concealed', 'Menzin', 'Menzin'],
        description: 'Extra han for concealed',
        check: hand => !hand.isOpen
    } as ExtraHan
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
    // ================== 1 han ==================
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
        check: hand => hand.chis.filter(t1 => hand.chis.filter(t2 => areSimilarTiles(t1[0], t2[0])).length > 1).length % 4 > 1 // length = 2 or 3. 4 would be Ryanpeikou
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
        check: hand => hand.chis.some(t1 => allSuitsPresent(hand.chis.map(c => c[0]).filter(t2 => tileRank(t1[0]) === tileRank(t2)))),
        extras: extraIfConcealed
    },
    'ITT': {
        han: 1,
        name: ['Straight', 'Ittsuu', '一気通貫'],
        description: 'Sequences of 1-2-3, 4-5-6 and 7-8-9 all in the same suit',
        canBeOpen: true,
        extras: extraIfConcealed,
        check: hand => hand.chis.some(t1 => tileRank(t1[0]) === '1'
                                         && hand.chis.some(t2 => tileRank(t2[0]) === '4' && t2.kind === t1.kind)
                                         && hand.chis.some(t3 => tileRank(t3[0]) === '7' && t3.kind === t1.kind))
    },
    'YAK': {
        han: 1,
        name: ['Honor tiles', 'Yakuhai', '役牌'],
        description: 'Any triplets or quads of dragons, the player\'s wind and the prevailing wind. If a wind is both the player\'s wind and the prevailing wind, it is worth two han per group.',
        canBeOpen: true,
        check: hand => hand.pons.filter(p => isDragon(p[0])).length
                     + hand.pons.filter(p => hand.isSeatWind(p[0])).length
                     + hand.pons.filter(p => hand.isPrevalentWind(p[0])).length
    },
    'CHA': {
        han: 1,
        name: ['Terminal or honor in each set', 'Chantaiyao', '全帯幺九'],
        description: 'The sequences in the hand must be 1-2-3 and 7-8-9, and triplets and the pair must be 1\'s, 9\'s and honor tiles. The hand contains at least one sequence.',
        canBeOpen: true,
        check: hand => hand.chis.length
                    && hand.allTiles.some(isHonor) // sets containing terminals but no honors is Junchan
                    && hand.sets.every(s => isTerminalOrHonor(s[0]) || isTerminal(s[s.length - 1]))
                    && !!hand.pair && isTerminalOrHonor(hand.pair[0]),
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

    // ================== 2 han ==================
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
        check: hand => hand.pons.some(t1 => allSuitsPresent(hand.pons.map(p => p[0]).filter(t2 => tileRank(t2) === tileRank(t1[0]))))
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
        name: ['Three quads', 'Sankantsu', '三色同刻]'],
        description: '',
        canBeOpen: true,
        check: hand => hand.pons.filter(s => s.length === 4).length === 3
    },
    'TOI': {
        han: 2,
        name: ['All triplet hand', 'Toitoi', '対々'],
        description: 'Four triplets/quads and a pair',
        canBeOpen: true,
        check: hand => hand.pons.length === 4
    },
    'HON': {
        han: 2,
        name: ['Half-flush', 'Honitsu', '混一色'],
        description: 'One suit including honours',
        canBeOpen: true,
        check: hand => hand.allTiles.some(isHonor)
                    && hand.allTiles.some(isSuited)
                    && hand.allTiles.filter(isSuited).map(t => tileKind(t)).filter(distinct).length === 1,
        extras: extraIfConcealed
    },
    'SSG': {
        han: 2,
        name: ['Little three dragons', 'Shousangen', '小三元'],
        description: 'Two triplets or quads of dragons, plus a pair of dragons',
        canBeOpen: true,
        check: hand => !!hand.pair && isDragon(hand.pair[0])
                    && hand.pons.filter(p => isDragon(p[0])).length === 2
    },
    'HRO': {
        han: 2,
        name: ['All terminals and honours', 'Honroutou', '混老頭'],
        description: 'Hand consists of only terminals and honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isTerminalOrHonor)
    },
    'JUN': {
        han: 2,
        name: ['Terminal in each set', 'Junchan taiyao', '純全帯么'],
        description: 'All sets contain terminals. At least one sequence and no honors',
        canBeOpen: true,
        check: hand => hand.chis.length
                    && hand.allTiles.every(isSuited) // anything with an honour is Chanta
                    && !!hand.pair && isTerminal(hand.pair[0])
                    && hand.sets.every(s => isTerminal(s[0]) || isTerminal(s[2])),
        extras: extraIfConcealed
    },

    // ================== 3 han ==================
    'RPK': {
        han: 3,
        name: ['Two sets of identical sequences', 'Ryanpeikou', '二盃口'],
        description: 'Two sets of identical sequences',
        canBeOpen: false,
        check: hand => hand.chis.filter(t1 => hand.chis.filter(t2 => areSimilarTiles(t1[0], t2[0])).length > 1).length === 4
    },

    // ================== 5 han ==================
    'CHN': {
        han: 5,
        name: ['Flush', 'Chinitsu', '清一色'],
        description: 'All tiles are of the same suit and no honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(t => tileKind(t)).filter(distinct).length === 1,
        extras: extraIfConcealed
    },
    'REN': {
        han: 5, // TODO don't count other yaku
        name: ['Hand of man', 'Renho', '人和'],
        description: 'Mahjong on discard in the first round',
        canBeOpen: false,
        check: hand => hand.state.firstRound && !hand.selfDrawn
    },

    // ================== Yakuman ==================
    'KMU': {
        han: YAKUMAN_HAN,
        name: ['Thirteen orphans', 'Kokushi musou', '国士無双'],
        description: 'One of each honour and terminal and one duplicate',
        canBeOpen: false,
        check: (hand) => hand.isThirteenOrphans
    },
    'CHU': {
        han: YAKUMAN_HAN,
        name: ['Nine gates', 'Chuuren poutou', '九連宝燈'],
        description: '1112345678999 of the same suit, plus one other tile of the same suit',
        canBeOpen: false,
        check: hand => hand.allTiles.every(isSuited)
                    && hand.allTiles.map(t => tileKind(t)).filter(distinct).length === 1
                    && ['1', '2', '3', '4', '5', '6', '7', '8', '9'].every(v => hand.allTiles.some(t => tileRank(t) === v))
    },
    'TEN': {
        han: YAKUMAN_HAN,
        name: ['Heavenly hand', 'Tenho', '天和'],
        description: 'East mahjong on initial fourteen tiles',
        canBeOpen: false,
        check: hand => hand.state.firstRound
                    && hand.selfDrawn
                    && hand.state.seatWind === Wind.East
    },
    'CHH': {
        han: YAKUMAN_HAN,
        name: ['Hand of earth', 'Chiihou', '地和'],
        description: 'Mahjong on self-draw in the first round',
        canBeOpen: false,
        check: hand => hand.state.firstRound
                    && hand.selfDrawn
                    && hand.state.seatWind !== Wind.East
    },
    'SUA': {
        han: YAKUMAN_HAN,
        name: ['Four concealed triplets', 'Suuankou', '四暗刻'],
        description: 'Four concealed triplets or quads and a pair',
        canBeOpen: false,
        check: hand => hand.pons.filter(s => s.concealed).length === 4
    },
    'SUK': {
        han: YAKUMAN_HAN,
        name: ['Four quads', 'Suukantsu', '四槓子'],
        description: 'Four quads and a pair',
        canBeOpen: true,
        check: hand => hand.pons.filter(s => s.length === 4).length === 4
    },
    'RYU': {
        han: YAKUMAN_HAN,
        name: ['All green', 'Ryuuiisou', '緑一色'],
        description: 'Hand of only green tiles: 2, 3, 4, 6, 8 of bamboo and green dragon',
        canBeOpen: true,
        check: hand => hand.allTiles.every(t => t === `${TileKind.Honor}${Dragon.Hatsu}` || (tileKind(t) === TileKind.Sou && '23468'.includes(tileRank(t))))
    },
    'CHR': {
        han: YAKUMAN_HAN,
        name: ['All terminals', 'Chinroutou', '清老頭'],
        description: 'Hand consists of only terminals, 1s and 9s',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isTerminal)
    },
    'TSU': {
        han: YAKUMAN_HAN,
        name: ['All honours', 'Tsuuiisou', '字一色'],
        description: 'Hand consists entirely of honours',
        canBeOpen: true,
        check: hand => hand.allTiles.every(isHonor)
    },
    'DSG': {
        han: YAKUMAN_HAN,
        name: ['Big three dragons', 'Daisangen', '大三元'],
        description: 'Three triplets or quads of dragons',
        canBeOpen: true,
        check: hand => hand.pons.filter(p => isDragon(p[0])).length === 3
    },
    'SSS': {
        han: YAKUMAN_HAN,
        name: ['Little four winds', 'Shousuushii', '小四喜'],
        description: 'Three triplets or quads of winds and a pair of winds',
        canBeOpen: true,
        check: hand => hand.pons.filter(p => isWind(p[0])).length === 3
                    && !!hand.pair && isWind(hand.pair[0])
    },
    'DSS': {
        han: YAKUMAN_HAN,
        name: ['Big four winds', 'Daisuushii', '大四喜'],
        description: 'Four triplets or quads of winds',
        canBeOpen: true,
        check: hand => hand.pons.filter(p => isWind(p[0])).length === 4
    },

    // ================== 0 han ==================
    // "Zero han" yakus are yaku like rules that don't give a yaku.
    // Although they are marked as zero to indicate they are not yaku, they will be counted as 1 han as long as there is a valid yaku
    'DOR': {
        han: 0,
        name: ['Dora', 'Dora', 'ドラ'],
        description: 'Extra han for dora',
        canBeOpen: true,
        check: hand => hand.state.doraIndicator.map(getDoraFromIndicator).reduce((total, dora) => total + hand.allTiles.filter(t => t === dora).length, 0)
    },
    'URA': {
        han: 0,
        name: ['Underneath dora', 'Uradora', '裏ドラ'],
        description: 'Extra han for uradora',
        canBeOpen: true,
        check: hand => hand.state.riichi && hand.state.uraDoraIndicator.map(getDoraFromIndicator).reduce((total, dora) => total + hand.allTiles.filter(t => t === dora).length, 0)
    }
};
