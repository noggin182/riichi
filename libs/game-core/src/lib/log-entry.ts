import { filter, OperatorFunction } from "rxjs";
import { GameDocument, PlayerIndex, TileIndex } from "./documents";
import { CallType } from "./moves";

export const enum LogEntryType {
    // TellingOff, // used to react to a player doing something they shouldn't: taking wrong tile, making wrong call, not waiting for turn, etc...
    FlippedTileInWall,
    DiceRolled,
    WallSplit,

    DeadHand,
    Redeal, // not sure if we can this? it happens are doing things like accidentally exposing tiles
    Chombo,
    Call,
    CalledTsumo,
    CancelledCall, // can't cancel a call for Ron or Tsumo, but Pon/Chi/Kan can be canelled before discarding (even after taking the tile and exposing thier own)
                    // cancelling a call after discarding results in a dead hand
    TookTile,
    DiscardedTile
}

export type LogEntry = {
    readonly type: LogEntryType.DeadHand | LogEntryType.Chombo,
    readonly player: PlayerIndex;
} | {
    readonly type: LogEntryType.WallSplit,
    readonly callingPlayer: PlayerIndex,
    readonly afterTile: TileIndex
} | {
    readonly type: LogEntryType.FlippedTileInWall,
    readonly callingPlayer: PlayerIndex,
    readonly tileIndex: TileIndex
} | {
    readonly type: LogEntryType.Call | LogEntryType.CancelledCall,
    readonly callingPlayer: PlayerIndex,
    readonly call: CallType
} | {
    readonly type: LogEntryType.TookTile | LogEntryType.DiscardedTile,
    readonly callingPlayer: PlayerIndex,
    readonly tileIndex: TileIndex
} | {
    readonly type: LogEntryType.DiceRolled,
    readonly callingPlayer: PlayerIndex,
    readonly values: readonly [number, number]
};

export function findFirstInLedger<T extends LogEntryType>(game: GameDocument, logType: T): (LogEntry & {type: T}) | undefined {
    return game.ledger.find((le: LogEntry) => le.type === logType) as (LogEntry & {type: T}) | undefined;
}

export function findLastInLedger<T extends LogEntryType>({ledger}: {ledger: readonly LogEntry[]}, logType: T): (LogEntry & {type: T}) | undefined {
    // return game.ledger.findLast((le: LogEntry) => le.type === logType) as (LogEntry & {type: T}) | undefined;
    return [...ledger].reverse().find((le: LogEntry) => le.type === logType) as (LogEntry & {type: T}) | undefined;
}

export function findAllInLedger<T extends LogEntryType>(game: GameDocument, logType: T): (LogEntry & {type: T})[] {
    return game.ledger.filter((le: LogEntry) => le.type === logType) as (LogEntry & {type: T})[];
}

export function filterLogType<T extends LogEntryType>(type: T) {
    return filter((logEntry: LogEntry) => logEntry.type === type) as OperatorFunction<LogEntry, LogEntry & {type: T}>;
}