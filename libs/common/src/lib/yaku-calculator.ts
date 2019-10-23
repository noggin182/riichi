import { YakuDefinition } from './types/yaku';
import { YAKUMAN_FAN } from './rules/yaku';
import { HandHelper } from './internal/hand-helper';
import { CountedYaku } from './types/points';

export function countYaku(hand: HandHelper, yakuDefinitions: YakuDefinition[]) {
    const countedYaku: CountedYaku[] = [];

    for (const yaku of yakuDefinitions.filter(y => !hand.isOpen || y.canBeOpen)) {
        const result = yaku.check(hand);
        if (result) {
            const fan = result === true ? (yaku.fan || 1) : result * (yaku.fan || 1);
            countedYaku.push({
                definition: yaku,
                fan,
                extras: yaku.extras ? yaku.extras.filter(e => e.check(hand)) : []
            });
        }
    }

    if (countedYaku.every(y => !y.definition.fan)) {
        // none of the counted yaku are actually yaku (most likely only dora)
        return [];
    }

    const yakumans = countedYaku.filter(cy => cy.definition.fan === YAKUMAN_FAN);
    return yakumans.length
         ? countedYaku.filter(cy => cy.definition.fan === YAKUMAN_FAN) // only return yakuman
         : countedYaku;
}
