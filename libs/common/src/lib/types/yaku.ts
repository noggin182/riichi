import { HandHelper } from '../internal/hand-helper';

export interface ExtraHan {
    readonly name: [string, string, string];
    readonly description: string;
    readonly check: (hand: HandHelper) => boolean;
}

export interface YakuDefinition {
    readonly han: number;
    readonly name: [string, string, string];
    readonly description: string;
    readonly canBeOpen: boolean;
    readonly check: (hand: HandHelper) => boolean | number;
    readonly extras?: {
        [abbreviation: string]: ExtraHan
    };
}

export interface YakuCollection {
    [abbreviation: string]: YakuDefinition;
}
