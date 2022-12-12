
import { InjectionToken } from "@angular/core";

// temp
export const TILE_CLICK_BEHAVIOUR = new InjectionToken('Tile click behaviour');
export const enum TileClickBehaviour {
    SplitAfter = 'splitAfter',
    SplitBefore = 'splitBefore',
    Take = 'take',
    Flip = 'flip',
    Discard = 'discard',
}
