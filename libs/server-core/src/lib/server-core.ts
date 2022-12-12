import { createNewDeck, randomNumberGenerator, Wind } from "@riichi/common";
import { GameDocument, MoveFunctions } from "@riichi/game-core";
import { InternalGameDocument, InternalPlayerInfo } from "./internal/documents";
import { moveHandlers } from "./move-handler";
import { DocumentStore } from "./stores";

export function serverCore(): string {
    return 'server-core';
}

export function createNewGameDocument(players: {name: string, id: string, avatarUrl: string}[], rng: Iterator<number> = randomNumberGenerator()): InternalGameDocument {
    const startingInfo: Omit<InternalPlayerInfo, 'name'|'id'|'avatarUrl'|'seatWind'> = {
        points: 1000,
        hand: [],
        discards: [],
        melds: [],
        knownTiles: [],
    };

    return {
        prevelantWind: Wind.East,
        players: [
            {...players[0], ...startingInfo, seatWind: Wind.East},
            {...players[1], ...startingInfo, seatWind: Wind.South},
            {...players[2], ...startingInfo, seatWind: Wind.West},
            {...players[3], ...startingInfo, seatWind: Wind.North},
        ],
        ledger: [],
        deck: createNewDeck(rng)
    };
}

export function createPlayerGameDocument(game: InternalGameDocument, playerId: string): GameDocument {
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    const knownTiles = game.players[playerIndex].knownTiles;
    // InternalGameDocument is mutable and also contains properties that we don't want to accidentally store
    // so explicitly copy each property
    return {
        prevelantWind: game.prevelantWind,
        players: game.players.map(p => ({
            name: p.name,
            id: p.id,
            avatarUrl: p.avatarUrl,
            seatWind: p.seatWind,
            points: p.points,
            hand: [...p.hand],
            discards: [...p.discards],
            melds: p.melds.map(m => ({
                tiles: [...m.tiles],
                claimedTile: m.claimedTile
            }))
        })),
        knownTiles:  game.deck.map((tile, index) => knownTiles.includes(index) ? tile : null),
        ledger: [...game.ledger]
    };
}

export function createMoveProxy(gameId: string, playerId: string, store: DocumentStore): MoveFunctions {
    return Object.fromEntries(Object.entries(moveHandlers).map(([name, handler]) => [
        name,
        (...args: unknown[]) => store.update(gameId, (previous) => (<any>handler)(previous, previous.players.findIndex(p => p.id === playerId), ...args))
    ])) as unknown as MoveFunctions;
}
