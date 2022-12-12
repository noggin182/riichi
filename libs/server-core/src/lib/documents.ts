import { Tile } from "@riichi/common";
import { GameDocument } from '@riichi/game-core';

export interface InternalPlayerInfo {
    readonly knownTiles: readonly number[];
}

/** The internal state of a game that should never be seen by the client */
export interface InternalGameDocument extends Omit<GameDocument, 'knownTiles'> {
    readonly deck: readonly Tile[];
    readonly internalPlayerInfo: InternalPlayerInfo[];
}