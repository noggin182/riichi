import { YakuCollection } from './types/yaku';
import { YAKUMAN_FAN } from './rules/yaku';
import { HandHelper } from './internal/hand-helper';
import { CountedYaku } from './types/points';

export function countYaku(hand: HandHelper, yakuDefinitions: YakuCollection) {
    const countedYaku: CountedYaku[] = [];

    for (const [abbreviation, definition] of Object.entries(yakuDefinitions).filter(p => !hand.isOpen || p[1].canBeOpen)) {
        const result = definition.check(hand);
        if (result) {
            const fan = result === true ? (definition.han || 1) : result * (definition.han || 1);
            countedYaku.push({
                abbreviation,
                definition,
                fan,
                extras: definition.extras
                      ? Object.entries(definition.extras).filter(p => p[1].check(hand)).map(p => Object.assign({abbreviation: p[0]}, p[1]))
                      : []
            });
        }
    }

    if (countedYaku.every(y => !y.definition.han)) {
        // none of the counted yaku are actually yaku (most likely only dora)
        return [];
    }

    const yakumans = countedYaku.filter(cy => cy.definition.han === YAKUMAN_FAN);
    return yakumans.length
         ? countedYaku.filter(cy => cy.definition.han === YAKUMAN_FAN) // only return yakuman
         : countedYaku;
}
