import { WinningHand } from './winning-hand';
import { HandStyle } from '@riichi/definitions';

export enum ConcealedType {
    CanBeOpen,
    MustBeOpen,
    MustBeConcealed
}

export interface ExtraFan {
    name: [string, string],
    description: string,
    check: (hand: WinningHand) => boolean
}

export interface Yaku {
    fan: number;
    name: [string, string],
    description: string,
    style: ConcealedType,
    handStyle?: HandStyle,
    check: (hand: WinningHand) => boolean | number,
    extras?: ExtraFan[]
}
