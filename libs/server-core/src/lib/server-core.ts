import { GameState, Tile } from "@riichi/common";
import { Observable } from "rxjs";

export function serverCore(): string {
    return 'server-core';
}

export interface RiichiServer {
    readonly gameState$: Observable<GameState>;
}

/// This function is called by the server
export function makeMove(gameState: GameState, desk: Tile[], playerId: string, move: unknown): {
    newState: GameState
} {
    return {
        newState: gameState
    }
};