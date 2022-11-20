import { HandHelper, TileSet } from '../internal/hand-helper';
import { FinalMeld } from './hand';
import { Wind } from '../types/tile';
import { YakuDefinition, ExtraHan } from './yaku';

export interface FuDefinition {
    readonly fu: number;
    readonly name: [string, string, string];
    readonly check: (hand: HandHelper) => boolean | readonly TileSet[];
    readonly blocksRounding?: boolean;
}

export interface CountedFu {
    readonly definition: FuDefinition;
    readonly meld: FinalMeld | null;
}

export interface CountedYaku {
    readonly abbreviation: string;
    readonly definition: Readonly<YakuDefinition>;
    readonly han: number;
    readonly extras: readonly (ExtraHan & {abbreviation: string})[];
}

export interface PointsLimit {
    name: string;
    points: number;
    check: (han: number, points: number) => boolean;
}

export interface PaymentInfo {
    readonly basePoints: number;
    readonly limit: string | undefined;
    readonly payments: readonly {
        readonly from: Wind;
        readonly ammount: number;
    }[];
}
