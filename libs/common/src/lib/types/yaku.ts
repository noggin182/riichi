import { HandHelper } from '../internal/hand-helper';

export interface ExtraFan {
    readonly name: [string, string];
    readonly description: string;
    readonly check: (hand: HandHelper) => boolean;
}

export interface YakuDefinition {
    readonly fan: number;
    readonly name: [string, string];
    readonly description: string;
    readonly canBeOpen: boolean;
    readonly check: (hand: HandHelper) => boolean | number;
    readonly extras?: ExtraFan[];
}
