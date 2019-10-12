import { Injectable } from "@angular/core";
import { Tile, Meld } from '@riichi/definitions';

export enum AppendStyle {
    Concealed,
    Chi,
    Pon, 
    Kan,
    ClosedKan
}

@Injectable({providedIn: 'root'})
export class State {
    currentLanguage: 0 | 1 = 0;
    blackTiles = false;
    appendStyle = AppendStyle.Concealed;

    hand: {
        concealed: Tile[];
        melds: Meld[]
    } = {concealed: [], melds: []}

    appendTile(tile: Tile) {
        if (this.appendStyle === AppendStyle.Concealed) {
            this.hand.concealed.push(tile);
        }
    }
}