import { createNewDeck, GameState, Tile } from "@riichi/common";
import { RiichiServer } from "@riichi/server-core";
import { Subject } from "rxjs";

export function testServer(): string {
    return 'test-server';
}

export class TestServer implements RiichiServer {
    constructor() {
        this.internalDeck = createNewDeck();
    }

    public internalDeck: Tile[];

    private gameSubject$ = new Subject<GameState>();
    gameState$ = this.gameSubject$.asObservable();
}