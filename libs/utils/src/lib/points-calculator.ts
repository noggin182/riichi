import { WinningHand } from './winning-hand';
import { Tile, TileSuit } from '@riichi/definitions';
import { isSimple, isTerminalOrHonor, getSuitFromTile, getValueFromTile } from './tile-utils';
import { isPon, isKan, isChi } from './yaku-definitions';

export interface FuDefinition {
    fu: number,
    name: [string, string],
    check: (hand: WinningHand) => boolean | Tile[][];
}

export interface CountedFu {
    definition: FuDefinition,
    tiles: Tile[] | null; // for melded sets, this will reference the tile array from the meld
}

const SevenPairsFu: FuDefinition = {
    fu: 25,
    name: ['Seven Pairs', 'Chii Toitsu'],
    check: hand => hand.isSevenPairs
}

const OpenPinfu: FuDefinition = {
    fu: 2,
    name: ['Open pinfu', 'Open pinfu'],
    check: hand => hand.mahjong.melds.length && hand.chis.length === 4
}

const Fus: FuDefinition[] = [
    {
        fu: 20,
        name: ['Winning hand', 'Fūtei'],
        check: () => true // always award the base points
    },
    {
        fu: 10,
        name: ['Concealed on a discard', 'menzen-kafu'],
        check: hand => !hand.selfDrawn && hand.mahjong.melds.length === 0
    },
    // ============ Simple melds =============
    {
        fu: 2,
        name: ['Open pon of simples', 'Min-kōtsu'],
        check: hand => hand.mahjong.melds.map(m => m.tiles).filter(s => isPon(s) && isSimple(s[0]))
    },
    {
        fu: 4,
        name: ['Closed pon of simples', 'An-kōtsu'],
        check: hand => hand.mahjong.concealed.filter(s => isPon(s) && isSimple(s[0]))
    },
    {
        fu: 8,
        name: ['Open kan of simples', 'Min-katsu'],
        check: hand => hand.mahjong.melds.map(m => m.tiles).filter(s => isKan(s) && isSimple(s[0]))
    },
    {
        fu: 16,
        name: ['Closed kan of simples', 'An-katsu'],
        check: hand => hand.mahjong.concealed.filter(s => isKan(s) && isSimple(s[0]))
    },

    // ============ Terminal/honor melds =============
    {
        fu: 4,
        name: ['Open pon of terminal/honors', 'Min-kōtsu'],
        check: hand => hand.mahjong.melds.map(m => m.tiles).filter(s => isPon(s) && isTerminalOrHonor(s[0]))
    },
    {
        fu: 8,
        name: ['Closed pon of terminal/honors', 'An-kōtsu'],
        check: hand => hand.mahjong.concealed.filter(s => isPon(s) && isTerminalOrHonor(s[0]))
    },
    {
        fu: 16,
        name: ['Open kan of terminal/honors', 'Min-katsu'],
        check: hand => hand.mahjong.melds.map(m => m.tiles).filter(s => isKan(s) && isTerminalOrHonor(s[0]))
    },
    {
        fu: 32,
        name: ['Closed kan of terminal/honors', 'An-katsu'],
        check: hand => hand.mahjong.concealed.filter(s => isKan(s) && isTerminalOrHonor(s[0]))
    },

    // ============ Terminal/honor melds =============
    {
        fu: 2,
        name: ['Pair of seated winds', 'toitsu'],
        check: hand => hand.pairTile === hand.seatedWindTile
    },
    {
        fu: 2,
        name: ['Pair of prevailing winds', 'toitsu'],
        check: hand => hand.pairTile === hand.prevailingWindTile
    },
    {
        fu: 2,
        name: ['Pair of dragons', 'toitsu'],
        check: hand => getSuitFromTile(hand.pairTile) === TileSuit.Dragon
    },

    // ============ Waits =============
    {
        fu: 2,
        name: ['Pair wait', 'tanki-machi'],
        check: hand => hand.winningTile === hand.pairTile ? [[hand.pairTile, hand.pairTile]] : false
    },
    {
        fu: 2,
        name: ['Middle wait', 'kanchan-machi'],
        check: hand => hand.winningTile !== hand.pairTile
                    && hand.mahjong.concealed.filter(isChi).map(s => [s]).find(ss => ss[0][1] === hand.winningTile) || false //  hand.winningTile === hand.pairTile
    },
    {
        fu: 2,
        name: ['Edge wait', 'penchan-machi'],
        check: hand => hand.winningTile !== hand.pairTile
                    && !hand.mahjong.concealed.filter(isChi).some(s => s[1] === hand.winningTile)
                    && hand.mahjong.concealed.filter(isChi).map(s => [s]).find(ss => (ss[0][0] === hand.winningTile && getValueFromTile(ss[0][2]) !== 6)
                                                                                  || (ss[0][2] === hand.winningTile && getValueFromTile(ss[0][0]) !== 2)) || false
    },

    // ============ Hand Style =============
    {
        fu: 2,
        name: ['Self draw', 'Tsumo'],
        check: hand => hand.selfDrawn
    }
]
    
export function calculateFu(hand: WinningHand): CountedFu[] {
    if (hand.isSevenPairs) {
        return [{
            definition: SevenPairsFu,
            tiles: null
        }]
    }

    const counted: CountedFu[] = [];
    for (const fuDef of Fus) {
        const result = fuDef.check(hand);
        if (result) {
            if (result === true) {
                counted.push({
                    definition: fuDef,
                    tiles: null
                });
            } else {
                counted.push(...result.map(set => ({
                    definition: fuDef,
                    tiles: set
                })));
            }
        }
    }

    if (counted.length === 1) {
        counted.push({
            definition: OpenPinfu,
            tiles: null
        });
    }

    const digit = counted.reduce((total, c) => total + c.definition.fu, 0) % 10;
    if (digit) {
        counted.push({
            definition: {
                fu: 10 - digit,
                name: ['Round up', 'Round up'],
                check: () => true
            },
            tiles: null
        });
    }

    return counted;
}