import { Wind } from "@riichi/common";
import {
    calculateStartOfWall,
    calculateWallFromDiceValue,
    DECK_SIZE,
    findFirstInLedger,
    GameDocument,
    getDiceValue,
    LogEntryType,
    MoveFunctions,
    PlayerIndex,
    TileIndex,
    findLastInLedger,
    findAllInLedger,
    CallType
 } from "@riichi/game-core";

export const moveValidators: {[K in keyof MoveFunctions]: MoveFunctions[K] extends (...args: infer P) => void ? (game: GameDocument, callingPlayer: PlayerIndex, ...args: P) => (true | string) : never } = {

    rollDice(game: GameDocument, callingPlayer: PlayerIndex) {
        if (findFirstInLedger(game, LogEntryType.DiceRolled)) {
            return "Dice have already been roled";
        }
        
        if (game.players[callingPlayer].seatWind !== Wind.East) {
            return "East should roll the dice";
        }

        return true;
    },

    splitWall(game: GameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        const diceValue = getDiceValue(game);
        if (!diceValue) {
            return 'Dice have not been rolled yet';
        }

        const splits = findAllInLedger(game, LogEntryType.WallSplit);

        if (splits.length >= 2) {
            // TODO: update this when we handle Kans
            return 'Wall is already split';
        }

        const sideToSplit = calculateWallFromDiceValue(diceValue);
        const playerOnSplittingSide = game.players.find(p => p.seatWind === sideToSplit)!;
        if (playerOnSplittingSide.id !== game.players[callingPlayer].id) {
            return `${playerOnSplittingSide.name} should be splitting the wall`;
        }

        if (splits.length === 0) {
            const startOfWall = calculateStartOfWall(diceValue);
            const placeToSplit = startOfWall - 2;
            if (tileIndex !== placeToSplit) {
                return 'Not the correct place to split the wall. Count the number shown on the dice from the right side of your wall. ' + placeToSplit;
            }
        } else if (splits.length === 1) {
            if (tileIndex != (splits[0].afterTile + DECK_SIZE - 14) % DECK_SIZE) {
                return 'Not the correct place to split the wall. The dead wall should contain 14 tiles';
            }
        }

        return true;
    },

    takeTile(game: GameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        if (findAllInLedger(game, LogEntryType.WallSplit).length < 2) {
            return 'Please wait until after the dice have been rolled and the wall has been split before taking tiles';
        }

        if (game.players.some(p => p.hand.length < 13 && p.melds.length == 0)) {
            // we are still dealing, so apply some special handling
        }

        const nextTileInWall = nextDrawableTile(game);
        if (tileIndex !== nextTileInWall) {
            return 'Wrong tile to take';
        }

        return true;
    },

    flipTileInWall(game: GameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        const personToFlip = calculateWallFromDiceValue(getDiceValue(game));
        const playerOnSplittingSide = game.players.find(p => p.seatWind === personToFlip)!;
        if (game.players[callingPlayer].seatWind !== personToFlip) {
            return `${playerOnSplittingSide.name} should be flipping the dora`;
        }

        const tileToflip = (calculateStartOfWall(getDiceValue(game)) + DECK_SIZE - 6) % DECK_SIZE;
        if (tileIndex !== tileToflip) {
            return 'Wrong tile to flip';
        }

        return true;
    },

    discard(game: GameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        if (!game.players[callingPlayer].hand.includes(tileIndex)) {
            return 'Cannot discard a tile you don\'t have';
        }
        if (game.players[callingPlayer].hand.length + game.players[callingPlayer].melds.length != 14) {
            return 'Not your turn to discard';
        }
        return true;
    },

    makeCall(game: GameDocument, callingPlayer: PlayerIndex, call: CallType) {
        throw new Error("Function not implemented.");
    },

    warnPlayer(game: GameDocument, callingPlayer: PlayerIndex, player: PlayerIndex) {
        throw new Error("Function not implemented.");
    },

    returnTileToWall(game: GameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex) {
        throw new Error("Function not implemented.");
    },

    returnTileToPlayersDiscards(game: GameDocument, callingPlayer: PlayerIndex, tileIndex: TileIndex, player: PlayerIndex) {
        throw new Error("Function not implemented.");
    },
}

function nextDrawableTile(game: GameDocument): TileIndex {
    const takenTiles = Object.values(game.players).map(p => [p.hand, p.discards, p.melds.map(m => m.tiles)]).flat(3);

    const firstTile = calculateStartOfWall(getDiceValue(game));
    if (takenTiles.length === 0) {
        return firstTile;
    }

    let drawingOrder = new Array(DECK_SIZE).fill(1).map((_, i) => i ^ 1);
    drawingOrder = [...drawingOrder.slice(firstTile, DECK_SIZE), ...drawingOrder.slice(0, firstTile)];

    return drawingOrder.find(t => !takenTiles.includes(t))!; // TODO: handle empty
}
