import { createNewDeck, randomNumberGenerator, Wind } from "@riichi/common";
import { GameDocument, MoveFunctions, PlayerInfo } from "@riichi/game-core";
import { InternalGameDocument } from "./documents";
import { moveHandlers } from "./move-handler";
import { DocumentStore } from "./stores";

export function serverCore(): string {
    return 'server-core';
}

export function createNewGameDocument(players: {name: string, id: string, avatarUrl: string}[], rng: Iterator<number> = randomNumberGenerator()): InternalGameDocument {
    const startingInfo: Omit<PlayerInfo, 'name'|'id'|'avatarUrl'|'seatWind'> = {
        points: 1000,
        hand: [],
        discards: [],
        melds: [],
    };
    
    // return {
    //     prevelantWind: Wind.East,
    //     players: [
    //         {...players[0], ...startingInfo, hand:[ 0, 1, 2, 3], seatWind: Wind.East},
    //         {...players[1], ...startingInfo, hand:[ 4, 5, 6, 7], seatWind: Wind.South},
    //         {...players[2], ...startingInfo, hand:[ 8, 9,10,11], seatWind: Wind.West},
    //         {...players[3], ...startingInfo, hand:[12,13,14,15], seatWind: Wind.North},
    //     ],
    //     ledger: [],
    //     deck: createNewDeck(rng),
    //     tilesKnownToPlayers: {
    //         [players[0].id]: [ 0, 1, 2, 3],
    //         [players[1].id]: [ 4, 5, 6, 7],
    //         [players[2].id]: [ 8, 9,10,11],
    //         [players[3].id]: [12,13,14,15],
    //     }
    // };

    return {
        prevelantWind: Wind.East,
        players: [
            {...players[0], ...startingInfo, seatWind: Wind.East},
            {...players[1], ...startingInfo, seatWind: Wind.South},
            {...players[2], ...startingInfo, seatWind: Wind.West},
            {...players[3], ...startingInfo, seatWind: Wind.North},
        ],
        ledger: [],
        deck: createNewDeck(rng),
        internalPlayerInfo: [
            {knownTiles: []},
            {knownTiles: []},
            {knownTiles: []},
            {knownTiles: []}
        ]
    };
}

export function createPlayerGameDocument(game: InternalGameDocument, playerId: string): GameDocument {
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    const knownTiles = game.internalPlayerInfo[playerIndex].knownTiles;
    return {
        knownTiles: game.deck.map((tile, index) => knownTiles.includes(index) ? tile : null),
        prevelantWind: game.prevelantWind,
        players: game.players,
        ledger: game.ledger.slice()
    };
}

export function createMoveProxy(gameId: string, playerId: string, store: DocumentStore): MoveFunctions {
    return Object.fromEntries(Object.entries(moveHandlers).map(([name, handler]) => [
        name,
        (...args: unknown[]) => store.update(gameId, (previous) => (<any>handler)(previous, previous.players.findIndex(p => p.id === playerId), ...args))
    ])) as unknown as MoveFunctions;
}
