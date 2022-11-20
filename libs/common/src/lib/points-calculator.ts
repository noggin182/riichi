import { HandHelper } from './internal/hand-helper';
import { PointsLimit, CountedFu, PaymentInfo, FuDefinition } from './types/points';
import { Wind } from './types/tile';

export function countFu(hand: HandHelper, fuDefinitions: readonly FuDefinition[]): CountedFu[] {
    const counted: CountedFu[] = [];
    for (const fuDef of fuDefinitions) {
        const result = fuDef.check(hand);
        if (result) {
            if (result === true) {
                counted.push({
                    definition: fuDef,
                    meld: null
                });
            } else {
                counted.push(...result.map(set => ({
                    definition: fuDef,
                    meld: set.meld
                })));
            }
        }
    }
    if (!counted.some(c => c.definition.blocksRounding)) {
        const digit = counted.reduce((total, c) => total + c.definition.fu, 0) % 10;
        if (digit) {
            counted.push({
                definition: {
                    fu: 10 - digit,
                    name: ['Round up', 'Round up', 'Round up'],
                    check: () => true
                },
                meld: null
            });
        }
    }

    return counted;
}

export function calculatePayments(hand: HandHelper, han: number, fu: number, limits: readonly PointsLimit[]): PaymentInfo {
    // TODO: special payment for feeding last pon for big dragons/winds
    const rawPoints = fu * 2 ** (han + 2);

    let limitName: string | undefined = '';
    const limit = limits.find(l => l.check(han, rawPoints));
    limitName = limit?.name;
    const basePoints = limit ? limit.points : rawPoints;
    let payments: { from: Wind; ammount: number; }[] = [];

    if (!hand.selfDrawn) {
        payments = [{ from: hand.state.winningTileFromWind, ammount: basePoints * (hand.state.seatWind === Wind.East ? 6 : 4) }];
    } else {
        payments = [Wind.East, Wind.North, Wind.South, Wind.West].filter(w => w !== hand.state.seatWind).map(w => ({
            from: w,
            ammount: hand.state.seatWind === Wind.East || w === Wind.East ? basePoints * 2 : basePoints
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
