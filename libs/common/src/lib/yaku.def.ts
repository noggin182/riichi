import { WinningHand } from './winning-hand';

export enum ConcealedType {
    CanBeOpen,
    MustBeOpen,
    MustBeConcealed
}

export interface ExtraFan {
    name: [string, string];
    description: string;
    check: (hand: Omit<WinningHand, 'mahjong'>) => boolean;
}

export interface YakuDefinition {
    fan: number;
    name: [string, string];
    description: string;
    style: ConcealedType;
    check: (hand: Omit<WinningHand, 'mahjong'>) => boolean | number;
    extras?: ExtraFan[];
}
