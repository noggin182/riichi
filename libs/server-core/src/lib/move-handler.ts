import { calculateStartOfWall, calculateWallFromDiceValue, CallType, DECK_SIZE, getDiceValue, LogEntry, LogEntryType, MoveFunctions, PlayerIndex, PlayerInfo, TileIndex } from '@riichi/game-core';
import { InternalGameDocument, InternalPlayerInfo } from "./documents";

export const moveHandlers: {[K in keyof MoveFunctions]: MoveFunctions[K] extends (...args: infer P) => void ? (game: InternalGameDocument, callingPlayer: PlayerIndex, ...args: P) => InternalGameDocument : never } = {

    rollDice(game: InternalGameDocument, callingPlayer: PlayerIndex) {
        // TODO: should we store the seed or current w/x in the InternalGameDocument so this is deterministic?
        return appendToLog(game, {
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
        return appendToLog(game, {
            type: LogEntryType.WallSplit,
            callingPlayer,
            afterTile: topTile
        });
    },

    takeTile(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        return patchGame(game, {
            internalPlayerInfo: {
                [callingPlayer]: {
                    knownTiles: [...game.internalPlayerInfo[callingPlayer].knownTiles, tileIndex]
                }
            },
            players: {
                [callingPlayer]: {
                    hand: [...game.players[callingPlayer].hand, tileIndex]
                }
            }
        }, {
            type: LogEntryType.TookTile,
            callingPlayer,
            tileIndex
        });
    },

    flipTileInWall(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        const personToFlip = calculateWallFromDiceValue(getDiceValue(game));
        if (game.players[callingPlayer].seatWind !== personToFlip) {
            console.warn('Wrong player flipping the dora', callingPlayer, personToFlip);
        }

        const tileToflip = (calculateStartOfWall(getDiceValue(game)) + DECK_SIZE - 6) % DECK_SIZE;
        if (tileIndex !== tileToflip) {
            console.warn("Wrong tile to flip", {callingPlayer, tileToflip, tileIndex});
            return game;
        }

        // TODO: handle flipping after kan
        return patchGame(game, {
            internalPlayerInfo: {
                [0]: { knownTiles: [...game.internalPlayerInfo[0].knownTiles, tileIndex] },
                [1]: { knownTiles: [...game.internalPlayerInfo[1].knownTiles, tileIndex] },
                [2]: { knownTiles: [...game.internalPlayerInfo[2].knownTiles, tileIndex] },
                [3]: { knownTiles: [...game.internalPlayerInfo[3].knownTiles, tileIndex] },
            }
        }, {
            type: LogEntryType.FlippedTileInWall,
            callingPlayer,
            tileIndex
        });
    },

    discard(game: InternalGameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        if (!game.players[callingPlayer].hand.includes(tileIndex)) {
            console.warn("Cannot discard a tile you don't have", {callingPlayer, tileIndex})
            return game;
        }
        return patchGame(game, {
            players: {
                [callingPlayer]: {
                    hand: game.players[callingPlayer].hand.filter(t => t !== tileIndex),
                    discards: [...game.players[callingPlayer].discards, tileIndex]
                }
            },
            internalPlayerInfo: {
                [0]: { knownTiles: [...game.internalPlayerInfo[0].knownTiles, tileIndex] },
                [1]: { knownTiles: [...game.internalPlayerInfo[1].knownTiles, tileIndex] },
                [2]: { knownTiles: [...game.internalPlayerInfo[2].knownTiles, tileIndex] },
                [3]: { knownTiles: [...game.internalPlayerInfo[3].knownTiles, tileIndex] },
            }
        }, {
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

type PartialInternalGameDocument = Partial<Omit<InternalGameDocument, 'players' | 'internalPlayerInfo'>> & {
    players?: Partial<Record<PlayerIndex, PlayerInfo>>;
    internalPlayerInfo?: Partial<Record<PlayerIndex, InternalPlayerInfo>>;
}

function patchGame(game: InternalGameDocument, patch: PartialInternalGameDocument, logEntry: LogEntry): InternalGameDocument {
    return {
        prevelantWind: patch.prevelantWind ?? game.prevelantWind,
        deck: patch.deck ?? game.deck,
        players: [
            patch.players?.[0] ? {...game.players[0], ...patch.players[0] } : game.players[0],
            patch.players?.[1] ? {...game.players[1], ...patch.players[1] } : game.players[1],
            patch.players?.[2] ? {...game.players[2], ...patch.players[2] } : game.players[2],
            patch.players?.[3] ? {...game.players[3], ...patch.players[3] } : game.players[3],
        ],
        internalPlayerInfo: [
            patch.internalPlayerInfo?.[0] ? {...game.internalPlayerInfo[0], ...patch.internalPlayerInfo[0] } : game.internalPlayerInfo[0],
            patch.internalPlayerInfo?.[1] ? {...game.internalPlayerInfo[1], ...patch.internalPlayerInfo[1] } : game.internalPlayerInfo[1],
            patch.internalPlayerInfo?.[2] ? {...game.internalPlayerInfo[2], ...patch.internalPlayerInfo[2] } : game.internalPlayerInfo[2],
            patch.internalPlayerInfo?.[3] ? {...game.internalPlayerInfo[3], ...patch.internalPlayerInfo[3] } : game.internalPlayerInfo[3],
        ],
        ledger: [...game.ledger, logEntry],
    }
}

function nextDrawableTile(game: InternalGameDocument): TileIndex {
    const takenTiles = Object.values(game.players).map(p => [p.hand, p.discards, p.melds.map(m => m.tiles)]).flat(3);
    const firstTile = calculateStartOfWall(getDiceValue(game));
    if (takenTiles.length === 0) {
        return firstTile;
    }

    return (Math.max(...takenTiles.map(t => (t - firstTile + DECK_SIZE) % DECK_SIZE)) + firstTile + 1 + DECK_SIZE)  % DECK_SIZE
}

function appendToLog(game: InternalGameDocument, logEntry: LogEntry): InternalGameDocument {
    return {
        ...game,
        ledger: [...game.ledger, logEntry]
    };
}
