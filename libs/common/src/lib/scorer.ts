import { HandHelper } from './internal/hand-helper';
import { Mahjong } from './types/hand';
import { countYaku } from './yaku-calculator';
import { calculatePayments, countFu, } from './points-calculator';
import { CountedYaku, CountedFu, PaymentInfo } from './types/points';
import { defaultYakuDefinitions } from './rules/yaku';
import { defaultFuDefinitions } from './rules/points';
import { defaultLimits } from './rules/limits';
import { WinState } from './types/state';

export interface ScoredHand {
    readonly mahjong: Mahjong;
    readonly state: WinState;
    readonly yaku: readonly CountedYaku[];
    readonly fu:   readonly CountedFu[];
    readonly payment: PaymentInfo;

    readonly totalFan: number;
    readonly totalFu: number;
}

const defaultRules = {
    yaku: defaultYakuDefinitions,
    fu: defaultFuDefinitions,
    limits: defaultLimits
};

export function getWinningScore(mahjong: Mahjong, round: WinState, rules = defaultRules): ScoredHand {
    const helper = new HandHelper(mahjong, round);
    const yaku = countYaku(helper, rules.yaku);
    const fu = countFu(helper, rules.fu);

    const totalFu = fu.reduce((total, f) => total + f.definition.fu, 0);
    const totalFan = yaku.reduce((total, y) => total + y.fan + y.extras.length , 0);

    const payments = calculatePayments(helper, totalFan, totalFu, rules.limits);

    return {
        mahjong: mahjong,
        state: round,
        yaku: yaku,
        fu: fu,
        totalFu: totalFu,
        totalFan: totalFan,
        payment: payments
    };
}