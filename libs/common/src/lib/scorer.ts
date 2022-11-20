import { HandHelper } from './internal/hand-helper';
import { Mahjong } from './types/hand';
import { countYaku } from './yaku-calculator';
import { calculatePayments, countFu, } from './points-calculator';
import { CountedYaku, CountedFu, PaymentInfo } from './types/points';
import { defaultYakuCollection } from './rules/yaku';
import { defaultFuDefinitions } from './rules/points';
import { defaultLimits } from './rules/limits';
import { WinState } from './types/win-state';

export interface ScoredHand {
    readonly mahjong: Mahjong;
    readonly state: WinState;
    readonly yaku: readonly CountedYaku[];
    readonly fu:   readonly CountedFu[];
    readonly payment: PaymentInfo;

    readonly totalHan: number;
    readonly totalFu: number;
}

const defaultRules = {
    yaku: defaultYakuCollection,
    fu: defaultFuDefinitions,
    limits: defaultLimits
};

export function getWinningScore(mahjong: Mahjong, round: WinState, rules = defaultRules): ScoredHand {
    const helper = new HandHelper(mahjong, round);
    const yaku = countYaku(helper, rules.yaku);
    const fu = countFu(helper, rules.fu);

    const totalFu = fu.reduce((total, f) => total + f.definition.fu, 0);
    const totalHan = yaku.reduce((total, y) => total + y.han + y.extras.length , 0);

    const payments = calculatePayments(helper, totalHan, totalFu, rules.limits);

    return {
        mahjong: mahjong,
        state: round,
        yaku: yaku,
        fu: fu,
        totalFu: totalFu,
        totalHan: totalHan,
        payment: payments
    };
}
