import { WinningHand } from './winning-hand';
import { isSimple, isTerminalOrHonor, getSuitFromTile, getValueFromTile } from './tile-utils';
import { isPon, isKan, isChi, yakuDefinitions, YAKUMAN_FAN } from './yaku-definitions';
import { CountedYaku } from './yaku';
import { Tile, TileSuit, Wind } from './definitions/tiles';

export interface FuDefinition {
    fu: number;
    name: [string, string];
    check: (hand: WinningHand) => boolean | Tile[][];
}

export interface CountedFu {
    definition: FuDefinition;
    tiles: Tile[] | null; // for melded sets, this will reference the tile array from the meld
}

const SevenPairsFu: FuDefinition = {
    fu: 25,
    name: ['Seven Pairs', 'Chii Toitsu'],
    check: hand => hand.isSevenPairs
};

const OpenPinfu: FuDefinition = {
    fu: 2,
    name: ['Open pinfu', 'Open pinfu'],
    check: hand => hand.mahjong.melds.length && hand.chis.length === 4
};

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
                    && (getValueFromTile(hand.winningTile))
                    && !hand.mahjong.concealed.filter(isChi).some(s => s[1] === hand.winningTile)
                    && hand.isPinfu
                    && (hand.chis.map(s => [s]).find(ss => ss[0][0] === hand.winningTile && getValueFromTile(ss[0][2]) === 9
                                                        || ss[0][2] === hand.winningTile && getValueFromTile(ss[0][2]) === 1)) || false
    },

    // ============ Hand Style =============
    {
        fu: 2,
        name: ['Self draw', 'Tsumo'],
        check: hand => hand.selfDrawn && !hand.isPinfu
    }
];

export function calculateFu(hand: WinningHand): CountedFu[] {
    if (hand.isSevenPairs) {
        return [{
            definition: SevenPairsFu,
            tiles: null
        }];
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

    if (counted.length === 1 && OpenPinfu.check(hand)) {
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

const limits: {name: string, points: number, check: (fan: number, points: number) => boolean}[] = [
    {
        name: 'Yakuman',
        points: 8000,
        check: fan => fan < 0
    },
    {
        name: 'Sanbaiman',
        points: 6000,
        check: fan => fan >= 11
    },
    {
        name: 'Baiman',
        points: 4000,
        check: fan => fan >= 8
    },
    {
        name: 'Haneman',
        points: 3000,
        check: fan => fan >= 6
    },
    {
        name: 'Mangan',
        points: 2000,
        check: (fan, points) => fan >= 5 || points >= 2000
    }
];


export interface PaymentInfo {
    basePoints: number;
    limit: string;
    payments: {
        from: Wind;
        ammount: number;
    }[];
}


export function calculatePoints(hand: WinningHand, yaku: CountedYaku[], fu: CountedFu[]): PaymentInfo {
    const totalFu = fu.reduce((total, f) => total + f.definition.fu, 0);
    const fan = yaku.reduce((total, y) => total + y.fan + y.extras.length , 0);

    const rawPoints = totalFu * 2 ** (fan + 2);

    let limitName = '';
    const limit = limits.find(l => l.check(fan, rawPoints));
    limitName = limit && limit.name;
    const basePoints = limit ? limit.points : rawPoints;
    let payments: { from: Wind; ammount: number; }[] = [];

    if (!hand.selfDrawn) {
        payments = [{ from: hand.winningTileFromWind, ammount: basePoints * hand.seatedWind === Wind.East ? 6 : 4 }];
    } else {
        payments = [Wind.East, Wind.North, Wind.South, Wind.West].filter(w => w !== hand.seatedWind).map(w => ({
            from: w,
            ammount: hand.seatedWind === Wind.East || w === Wind.East ? basePoints * 2 : basePoints
        }));
    }

    // finally round the payments up
    for (const payment of payments) {
        payment.ammount = Math.ceil(payment.ammount / 100) * 100;
    }

    return {
        limit: limitName,
        basePoints,
        payments
    };
}
