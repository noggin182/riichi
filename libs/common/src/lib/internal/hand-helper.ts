import { Tile, TileKind, TileRank } from '../types/tile';
import { Mahjong, FinalMeld, FinalMeldKind } from '../types/hand';
import { isDragon } from '../utils/tile-checks';
import { WinState } from '../types/win-state';
import { tileKind, tileRank, tileValue } from '../utils/tile';

function isClosedMeld(meld: FinalMeld) {
    return meld.kind === FinalMeldKind.ClosedSet
        || meld.kind === FinalMeldKind.ClosedKan
        || meld.kind === FinalMeldKind.ClosedPair;
}

export interface TileSet {
    [index: number]: Tile;
    readonly rank: TileRank;
    readonly kind: TileKind;
    readonly meld: FinalMeld;
    readonly length: number;
    readonly concealed: boolean;
}

export class HandHelper {
    constructor(mahjong: Readonly<Mahjong>, readonly state: WinState) {
        this.finalTile = mahjong.finalTile;
        this.allTiles = mahjong.melds.map(m => m.tiles).flat().sort();
        this.isSevenPairs = mahjong.melds.length === 7;
        this.isThirteenOrphans = mahjong.melds.length === 1 && mahjong.melds[0].tiles.length === 14;
        this.isOpen = mahjong.melds.some(m => !m.tiles.includes(mahjong.finalTile) && !isClosedMeld(m));
        this.selfDrawn = state.winningTileFromWind === state.seatWind;

        const pairMeld = !this.isSevenPairs && mahjong.melds.find(m => m.tiles.length === 2);
        if (pairMeld) {
            this.pair = {
                rank: tileRank(pairMeld.tiles[0]),
                kind: tileKind(pairMeld.tiles[0]),
                length: pairMeld.tiles.length,
                meld: pairMeld,
                concealed: isClosedMeld(pairMeld),
                0: pairMeld.tiles[0],
                1: pairMeld.tiles[1],
            };
        }

        this.valuelessPair = !!this.pair && !isDragon(this.pair[0]) && !this.isSeatWind(this.pair[0]) && !this.isPrevalentWind(this.pair[0]);

        const sets = mahjong.melds.filter(m => m.tiles.length > 2).map(m => {
            const tiles = m.tiles.slice().sort();
            return {
                rank: tileRank(tiles[0]),
                kind: tileKind(tiles[0]),
                length: tiles.length,
                meld: m,
                concealed: isClosedMeld(m),
                0: tiles[0],
                1: tiles[1],
                2: tiles[2],
                3: tiles[3]
            };
        });
        this.sets = sets;
        this.chis = sets.filter(s => s[0] !== s[1]);
        this.pons = sets.filter(s => s[0] === s[1]);

        this.isPinfu = !this.isOpen
                    && !this.pons.length
                    &&  this.chis.some(s => (s[0] === mahjong.finalTile && tileValue(s[0]) !== 7)
                                         || (s[2] === mahjong.finalTile && tileValue(s[2]) !== 3))
                    &&  this.valuelessPair;
    }

    readonly allTiles: readonly Tile[];
    readonly isSevenPairs: boolean;
    readonly isThirteenOrphans: boolean;
    readonly isOpen: boolean;
    readonly selfDrawn: boolean;
    readonly isPinfu: boolean;
    readonly pair: TileSet | undefined;
    readonly valuelessPair: boolean;
    readonly finalTile: Tile;

    readonly sets: readonly TileSet[];
    readonly chis: readonly TileSet[];
    readonly pons: readonly TileSet[];

    // ======== helper functions ========
    isPrevalentWind = (tile: Tile) => {
        return tileKind(tile) === TileKind.Honor && tileRank(tile) === this.state.prevalentWind;
    }

    isSeatWind = (tile: Tile) => {
        return tileKind(tile) === TileKind.Honor && tileRank(tile) === this.state.seatWind;
    }


}
