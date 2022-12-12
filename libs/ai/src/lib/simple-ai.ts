import { RelativeSeat, relativeSeatToWind, Wind } from "@riichi/common";
import { GameDocument, ServerConnection } from "@riichi/game-core";

import { delay, pairwise } from "rxjs";

export class SimpleAi {
    constructor(private readonly wind: Wind, private readonly connection: ServerConnection) {
        connection.gameDocument$.pipe(delay(1000), pairwise()).subscribe(([previousState, newState]) => this.update(previousState, newState));
    }

    private readonly previousPlayer = relativeSeatToWind(this.wind, RelativeSeat.Left);

    private update(previousState: GameDocument, newState: GameDocument): void {
        if (previousState.players[this.previousPlayer].discards.length < newState.players[this.previousPlayer].discards.length) {
            // player to the left of us has just discarded, our turn
            this.connection.move.takeTile(-1 /* TODO: figure out what tile to draw */);
        } else if (newState.players[this.wind].hand.length == 14) {
            // simple for now, just discard the tile we drew
            this.connection.move.discard(newState.players[this.wind].hand[13]);
        }
    }
}