import { WinningHand } from './winning-hand';

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

export interface YakuDefinition {
    fan: number;
    name: [string, string],
    description: string,
    style: ConcealedType,
    check: (hand: WinningHand) => boolean | number,
    extras?: ExtraFan[]
}
