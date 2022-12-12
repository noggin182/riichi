import {
    calculateStartOfWall,
    calculateWallFromDiceValue,
    CallType,
    DECK_SIZE,
    getDiceValue,
    LogEntry,
    LogEntryType,
    MoveFunctions,
    PlayerIndex,
    PlayerInfo,
    TileIndex
} from '@riichi/game-core';
import { InternalGameDocument, InternalPlayerInfo } from "./internal/documents";

export const moveHandlers: {[K in keyof MoveFunctions]: MoveFunctions[K] extends (...args: infer P) => void ? (game: InternalGameDocument, callingPlayer: PlayerIndex, ...args: P) => void : never } = {

    rollDice(game: InternalGameDocument, callingPlayer: PlayerIndex) {
        // TODO: should we store the seed or current w/x in the InternalGameDocument so this is deterministic?
        game.ledger.push({
            type: LogEntryType.DiceRolled,
            callingPlayer,
            values: [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
            ]
        });
    },

    splitWall(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        const topTile = tileIndex | 1;
        game.ledger.push({
            type: LogEntryType.WallSplit,
            callingPlayer,
            afterTile: topTile
        });
    },

    takeTile(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        // TODO: ensure tile exists nowhere else
        game.players[callingPlayer].hand.push(tileIndex);
        game.players[callingPlayer].knownTiles.push(tileIndex);

        game.ledger.push({
            type: LogEntryType.TookTile,
            callingPlayer,
            tileIndex
        });
    },

    flipTileInWall(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        // TODO: handle flipping after kan
        game.players[0].knownTiles.push(tileIndex);
        game.players[1].knownTiles.push(tileIndex);
        game.players[2].knownTiles.push(tileIndex);
        game.players[3].knownTiles.push(tileIndex);

        // TODO: handle flipping after kan
        game.ledger.push({
            type: LogEntryType.FlippedTileInWall,
            callingPlayer,
            tileIndex
        });
    },

    discard(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        // TODO: ensure tile exists nowhere
        game.players[0].hand = game.players[0].hand.filter(t => t !== tileIndex);
        game.players[1].hand = game.players[1].hand.filter(t => t !== tileIndex);
        game.players[2].hand = game.players[2].hand.filter(t => t !== tileIndex);
        game.players[3].hand = game.players[3].hand.filter(t => t !== tileIndex);

        game.players[callingPlayer].discards.push(tileIndex);

        game.players[0].knownTiles.push(tileIndex);
        game.players[1].knownTiles.push(tileIndex);
        game.players[2].knownTiles.push(tileIndex);
        game.players[3].knownTiles.push(tileIndex);

        game.ledger.push({
            type: LogEntryType.DiscardedTile,
            callingPlayer,
            tileIndex
        });
    },

    makeCall(game: InternalGameDocument, callingPlayer: PlayerIndex, call: CallType) {
        throw new Error("Function not implemented.");
    },

    warnPlayer(game: InternalGameDocument, callingPlayer: PlayerIndex, player: PlayerIndex) {
        throw new Error("Function not implemented.");
    },

    returnTileToWall(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        throw new Error("Function not implemented.");
    },

    returnTileToPlayersDiscards(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex, player: PlayerIndex) {
        throw new Error("Function not implemented.");
    },
}

