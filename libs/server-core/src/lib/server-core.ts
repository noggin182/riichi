import { GameState, PlayerState, TileIndex } from "@riichi/common";
import { Observable } from "rxjs";

export function serverCore(): string {
    return 'server-core';
}

export interface RiichiServerConnection {
    readonly gameState$: Observable<GameState>;
    readonly playerState$: Observable<PlayerState>;
    
    discard(tileIndex: TileIndex): Promise<void>;
    drawTile(tileIndex: TileIndex): Promise<void>;
}
