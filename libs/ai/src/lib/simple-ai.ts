import { GameState, RelativeSeat, relativeSeatToWind, Wind } from "@riichi/common";
import { RiichiServerConnection } from "@riichi/server-core";
import { delay, pairwise } from "rxjs";

export class SimpleAi {
    constructor(private readonly wind: Wind, private readonly connection: RiichiServerConnection) {
        connection.gameState$.pipe(delay(1000), pairwise()).subscribe(([previousState, newState]) => this.update(previousState, newState));
    }

    private readonly previousPlayer = relativeSeatToWind(this.wind, RelativeSeat.Left);

    private update(previousState: GameState, newState: GameState): void {
        if (previousState === newState) {
            console.warn("SAME!")
        }
        if (this.wind === Wind.South) {console.log ({previousState, newState})};
        if (previousState.players[this.previousPlayer].discards.length < newState.players[this.previousPlayer].discards.length) {
            // player to the left of us has just discarded, our turn
            this.connection.drawTile(-1 /* TODO: figure out what tile to draw */);
        } else if (newState.players[this.wind].hand.length == 14) {
            // simple for now, just discard the tile we drew
            this.connection.discard(newState.players[this.wind].hand[13]);
        }
        // throw new Error("Method not implemented.");
    }
}