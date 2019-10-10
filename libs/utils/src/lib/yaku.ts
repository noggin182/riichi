import { WinningHand } from './winning-hand';
import { Yaku, ConcealedType, ExtraFan } from './yaku.def';
import { yakuDefs, YakumanFan, noneYakus } from './yakus';
import { HandStyle } from '@riichi/definitions';

export interface CountedYaku {
    yaku: Readonly<Yaku>;
    fan: number;
    extras: Readonly<ExtraFan[]>;
}

export function countYaku(hand: WinningHand) {
    const countedYaku: CountedYaku[] = [];
    let yakuman = false;
    function collectYakus(yakus: Yaku[]) {
        for (const yaku of yakus) {
            if (hand.mahjong.style === (yaku.handStyle || HandStyle.Mahjong)) {
                const result = yaku.check(hand);
                if (result) {
                    const fan = result === true ? yaku.fan : result * yaku.fan;
                    countedYaku.push({
                        yaku,
                        fan,
                        extras: yaku.extras ? yaku.extras.filter(e => e.check(hand)) : []
                    });
                    
                    if (yaku.fan === YakumanFan) {
                        yakuman = true;
                    }
                }
            }
        }
    }

    collectYakus(yakuDefs);

    if (countedYaku.length) {
        collectYakus(noneYakus);
    }

    return yakuman ? countedYaku.filter(cy => cy.yaku.fan === YakumanFan) : countedYaku;
}