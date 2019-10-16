import { WinningHand } from './winning-hand';
import { isSimple, isPon, isHonor, isTerminal, isDragon, isChi } from './tile-utils';
import { CountedYaku } from './yaku';
import { FinalMeld, FinalMeldKind } from './definitions/mahjong-definition';
import { Wind } from './definitions/tile';

export interface FuDefinition {
    fu: number;
    name: [string, string];
    check: (hand: WinningHand) => boolean | readonly FinalMeld[];
}

export interface CountedFu {
    definition: FuDefinition;
    meld: FinalMeld | null;
}

const SevenPairsFu: FuDefinition = {
    fu: 25,
    name: ['Seven Pairs', 'Chii Toitsu'],
    check: hand => hand.isSevenPairs
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
        check: hand => !hand.selfDrawn && !hand.isOpen
    },
    // ============ Simple melds =============
    {
        fu: 2,
        name: ['Open pon of simples', 'Min-kōtsu'],
        check: hand => hand.melds.filter(m => isSimple(m.tiles[0]) && m.kind === FinalMeldKind.Pon)
    },
    {
        fu: 4,
        name: ['Closed pon of simples', 'An-kōtsu'],
        check: hand => hand.melds.filter(m => isSimple(m.tiles[0]) && m.kind === FinalMeldKind.Closed && isPon(m.tiles))
    },
    {
        fu: 8,
        name: ['Open kan of simples', 'Min-katsu'],
        check: hand => hand.melds.filter(m => isSimple(m.tiles[0]) && (m.kind === FinalMeldKind.Kan || m.kind === FinalMeldKind.AddedKan))
    },
    {
        fu: 16,
        name: ['Closed kan of simples', 'An-katsu'],
        check: hand => hand.melds.filter(m => isSimple(m.tiles[0]) && m.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Honor melds =============
    {
        fu: 4,
        name: ['Open pon of honors', 'Min-kōtsu'],
        check: hand => hand.melds.filter(m => isHonor(m.tiles[0]) && m.kind === FinalMeldKind.Pon)
    },
    {
        fu: 8,
        name: ['Closed pon of honors', 'An-kōtsu'],
        check: hand => hand.melds.filter(m => isHonor(m.tiles[0]) && m.kind === FinalMeldKind.Closed && isPon(m.tiles))
    },
    {
        fu: 16,
        name: ['Open kan of honors', 'Min-katsu'],
        check: hand => hand.melds.filter(m => isHonor(m.tiles[0]) && (m.kind === FinalMeldKind.Kan || m.kind === FinalMeldKind.AddedKan))
    },
    {
        fu: 32,
        name: ['Closed kan of honors', 'An-katsu'],
        check: hand => hand.melds.filter(m => isHonor(m.tiles[0]) && m.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Terminal melds =============
    {
        fu: 4,
        name: ['Open pon of terminals', 'Min-kōtsu'],
        check: hand => hand.melds.filter(m => isTerminal(m.tiles[0]) && m.kind === FinalMeldKind.Pon)
    },
    {
        fu: 8,
        name: ['Closed pon of terminals', 'An-kōtsu'],
        check: hand => hand.melds.filter(m => isTerminal(m.tiles[0]) && m.kind === FinalMeldKind.Closed && isPon(m.tiles))
    },
    {
        fu: 16,
        name: ['Open kan of terminals', 'Min-katsu'],
        check: hand => hand.melds.filter(m => isTerminal(m.tiles[0]) && (m.kind === FinalMeldKind.Kan || m.kind === FinalMeldKind.AddedKan))
    },
    {
        fu: 32,
        name: ['Closed kan of terminals', 'An-katsu'],
        check: hand => hand.melds.filter(m => isTerminal(m.tiles[0]) && m.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Pair melds =============
    {
        fu: 2,
        name: ['Pair of seated winds', 'Toitsu'],
        check: hand => hand.melds.filter(m => m.tiles.length === 2 && hand.isSeatWind(m.tiles[0]))
    },
    {
        fu: 2,
        name: ['Pair of prevailing winds', 'Toitsu'],
        check: hand => hand.melds.filter(m => m.tiles.length === 2 && hand.isPrevalentWind(m.tiles[0]))
    },
    {
        fu: 2,
        name: ['Pair of dragons', 'Toitsu'],
        check: hand => hand.melds.filter(m => m.tiles.length === 2 && isDragon(m.tiles[0]))
    },

    // ============ Waits =============
    {
        fu: 2,
        name: ['Pair wait', 'tanki-machi'],
        check: hand => hand.melds.filter(m => m.tiles.length === 2 && m.tiles.includes(hand.winningTile))
    },
    {
        fu: 2,
        name: ['Middle wait', 'kanchan-machi'],
        check: hand => hand.melds.filter(m => isChi(m.tiles) && m.tiles[1] === hand.winningTile)
    },
    {
        fu: 2,
        name: ['Edge wait', 'penchan-machi'],
        check: hand => !hand.isPinfu && hand.melds.filter(m => isChi(m.tiles) && (m.tiles[0] === hand.winningTile || m.tiles[1] === hand.winningTile))
    },

    // ============ Hand Style =============
    {
        fu: 2,
        name: ['Self draw', 'Tsumo'],
        check: hand => hand.selfDrawn && !hand.isPinfu
    },
    {
        fu: 2,
        name: ['Open pinfu', 'Open pinfu'],
        check: hand => hand.isOpen && hand.chis.length === 4 && hand.valuelessPair
    }
];

export function calculateFu(hand: WinningHand): CountedFu[] {
    if (hand.isSevenPairs) {
        return [{
            definition: SevenPairsFu,
            meld: null
        }];
    }

    const counted: CountedFu[] = [];
    for (const fuDef of Fus) {
        const result = fuDef.check(hand);
        if (result) {
            if (result === true) {
                counted.push({
                    definition: fuDef,
                    meld: null
                });
            } else {
                counted.push(...result.map(meld => ({
                    definition: fuDef,
                    meld
                })));
            }
        }
    }

    const digit = counted.reduce((total, c) => total + c.definition.fu, 0) % 10;
    if (digit) {
        counted.push({
            definition: {
                fu: 10 - digit,
                name: ['Round up', 'Round up'],
                check: () => true
            },
            meld: null
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

    // TODO: special payment for feeding last pon for big dragons/winds

    const rawPoints = totalFu * 2 ** (fan + 2);

    let limitName = '';
    const limit = limits.find(l => l.check(fan, rawPoints));
    limitName = limit && limit.name;
    const basePoints = limit ? limit.points : rawPoints;
    let payments: { from: Wind; ammount: number; }[] = [];

    if (!hand.selfDrawn) {
        payments = [{ from: hand.winningTileFromWind, ammount: basePoints * hand.seatWind === Wind.East ? 6 : 4 }];
    } else {
        payments = [Wind.East, Wind.North, Wind.South, Wind.West].filter(w => w !== hand.seatWind).map(w => ({
            from: w,
            ammount: hand.seatWind === Wind.East || w === Wind.East ? basePoints * 2 : basePoints
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
