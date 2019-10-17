import { WinningHand } from './winning-hand';
import { YakuDefinition, ExtraFan, ConcealedType } from './yaku.def';
import { yakuDefinitions, YAKUMAN_FAN, doraYaku } from './yaku-definitions';

export interface CountedYaku {
    definition: Readonly<YakuDefinition>;
    fan: number;
    extras: Readonly<ExtraFan[]>;
}

export function countYaku(hand: WinningHand) {
    const countedYaku: CountedYaku[] = [];
    let yakuman = false;
    function collectYaku(yakuDefs: YakuDefinition[]) {
        for (const yaku of yakuDefs) {
            if (yaku.style === ConcealedType.MustBeConcealed && hand.isOpen) {
                continue;
            }
            if (yaku.style === ConcealedType.MustBeOpen && !hand.isOpen) {
                continue;
            }
            const result = yaku.check(hand);
            if (result) {
                const fan = result === true ? yaku.fan : result * yaku.fan;
                countedYaku.push({
                    definition: yaku,
                    fan,
                    extras: yaku.extras ? yaku.extras.filter(e => e.check(hand)) : []
                });

                if (yaku.fan === YAKUMAN_FAN) {
                    yakuman = true;
                }
            }
        }
    }

    collectYaku(yakuDefinitions);

    if (countedYaku.length) {
        collectYaku(doraYaku);
    }

    return yakuman ? countedYaku.filter(cy => cy.definition.fan === YAKUMAN_FAN) : countedYaku;
}
