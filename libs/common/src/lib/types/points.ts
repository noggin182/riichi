import { HandHelper, TileSet } from '../internal/hand-helper';
import { FinalMeld } from './hand';
import { Wind } from '../types/tile';
import { YakuDefinition, ExtraFan } from './yaku';

export interface FuDefinition {
    readonly fu: number;
    readonly name: [string, string];
    readonly check: (hand: HandHelper) => boolean | readonly TileSet[];
    readonly blocksRounding?: boolean;
}

export interface CountedFu {
    readonly definition: FuDefinition;
    readonly meld: FinalMeld | null;
}

export interface CountedYaku {
    readonly definition: Readonly<YakuDefinition>;
    readonly fan: number;
    readonly extras: readonly ExtraFan[];
}

export interface PointsLimit {
    name: string;
    points: number;
    check: (fan: number, points: number) => boolean;
}

export interface PaymentInfo {
    readonly basePoints: number;
    readonly limit: string;
    readonly payments: readonly {
        readonly from: Wind;
        readonly ammount: number;
    }[];
}
