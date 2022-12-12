import { Wind } from "@riichi/common";
import { TileIndex } from "./documents";
import { findLastInLedger, LogEntry, LogEntryType } from "./log-entry";

export const DECK_SIZE = (9 + 9 + 9 + 4 + 3) * 4;

export function calculateWallFromDiceValue(value: number): Wind {
    switch ((value % 4) as 0 | 1 | 2 | 3) {
        case 1: return Wind.East;
        case 2: return Wind.South;
        case 3: return Wind.West;
        case 0: return Wind.North
    }
}

export function calculateStartOfWall(diceValue: number): number {
    const sideStart = ({
        // Note: this is the DRAWING order, not the seating order
        [Wind.East]:  0,
        [Wind.North]: 1,
        [Wind.West]:  2,
        [Wind.South]: 3,
    })[calculateWallFromDiceValue(diceValue)] * (DECK_SIZE / 4);
    return sideStart + (diceValue) * 2 + 1;
}

export function allTilesExcept(tiles: TileIndex[]) {
    return new Array(DECK_SIZE).map((_, i) => i).filter(t => !tiles.includes(t));
}

export function rotateTilesBy(tiles: TileIndex[], offset: number) {
    const split = tiles.findIndex(t => t >= offset);
    return [
        ...tiles.slice(split),
        ...tiles.slice(0, split),
    ];
}

export function getDiceValue(game: {ledger: readonly LogEntry[]}): number {
    const lastRoll = findLastInLedger(game, LogEntryType.DiceRolled);
    return lastRoll ? lastRoll.values[0] + lastRoll.values[1] : 0;
}
