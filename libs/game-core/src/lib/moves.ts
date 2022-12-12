import { PlayerIndex, TileIndex } from "./documents";

export const enum CallType {
    Pon,
    Chi,
    Kan,
    Ron,
    Riichi,
    Tsumo
}

export interface MoveFunctions {
    rollDice(): void;

    /** Split the wall _after_ tileIndex */
    splitWall(tileIndex: TileIndex): void;

    /** Called when taking a tile, this could be either from the wall, or from a player's discard pile */
    takeTile(tileIndex: TileIndex): void;

    flipTileInWall(tileIndex: TileIndex): void;

    /** Called when discarding a tile */
    discard(tileIndex: TileIndex): void;

    makeCall(call: CallType): void;

    /**
     * Give another player a friendly warning that they may be about to perform an illegal action
     * i.e. they took the wrong tile from the wall, and can avoid a penalty if they put it back
     */
    warnPlayer(player: PlayerIndex): void;

    returnTileToWall(tileIndex: TileIndex): void;

    returnTileToPlayersDiscards(tileIndex: TileIndex, player: PlayerIndex): void;
}
