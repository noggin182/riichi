import { Tile, TileKind } from '../types/tile';
import { Mahjong, FinalMeld, FinalMeldKind } from '../types/hand';
import { sortTiles, dummyBlankTile } from '../utils/tile';
import { isDragon } from '../utils/tile-checks';
import { WinState } from '../types/state';

function isClosedMeld(meld: FinalMeld) {
    return meld.kind === FinalMeldKind.ClosedSet
        || meld.kind === FinalMeldKind.ClosedKan
        || meld.kind === FinalMeldKind.ClosedPair;
}

export interface TileSet extends Tile {
    [index: number]: Tile;
    readonly meld: FinalMeld;
    readonly length: number;
    readonly concealed: boolean;
}

export class HandHelper {
    constructor(mahjong: Readonly<Mahjong>, readonly state: WinState) {
        this.finalTile = mahjong.finalTile;
        this.allTiles = [].concat(...mahjong.melds.map(m => m.tiles)).sort(sortTiles);
        this.isSevenPairs = mahjong.melds.length === 7;
        this.isThirteenOrphans = mahjong.melds.length === 1 && mahjong.melds[0].tiles.length === 14;
        this.isOpen = mahjong.melds.some(m => !m.tiles.includes(mahjong.finalTile) && !isClosedMeld(m));
        this.selfDrawn = state.winningTileFromWind === state.seatWind;

        this.pairTiles = !this.isSevenPairs && mahjong.melds.map(m => m.tiles).find(s => s.length === 2) || [dummyBlankTile, dummyBlankTile];
        this.pairTile = this.pairTiles[0];
        this.valuelessPair = !isDragon(this.pairTile) && !this.isSeatWind(this.pairTile) && !this.isPrevalentWind(this.pairTile);

        const sets = mahjong.melds.filter(m => m.tiles.length > 2).map(m => {
            const tiles = m.tiles.slice().sort();
            return {
                id: tiles[0].id,
                rank: tiles[0].rank,
                kind: tiles[0].kind,
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
        this.chis = sets.filter(s => s[0].rank !== s[1].rank);
        this.pons = sets.filter(s => s[0].rank === s[1].rank);

        this.isPinfu = !this.isOpen
                    && !this.pons.length
                    &&  this.chis.some(s => (s[0] === mahjong.finalTile && s[0].rank !== 7)
                                         || (s[2] === mahjong.finalTile && s[2].rank !== 3))
                    &&  this.valuelessPair;
    }

    readonly allTiles: readonly Tile[];
    readonly isSevenPairs: boolean;
    readonly isThirteenOrphans: boolean;
    readonly isOpen: boolean;
    readonly selfDrawn: boolean;
    readonly isPinfu: boolean;
    readonly pairTile: Tile;
    readonly pairTiles: readonly Tile[];
    readonly valuelessPair: boolean;
    readonly finalTile: Tile;

    readonly sets: readonly TileSet[];
    readonly chis: readonly TileSet[];
    readonly pons: readonly TileSet[];

    // ======== helper functions ========
    isPrevalentWind = (tile: Tile) => {
        return tile.kind === TileKind.Honor && tile.rank === this.state.prevalentWind;
    }

    isSeatWind = (tile: Tile) => {
        return tile.kind === TileKind.Honor && tile.rank === this.state.seatWind;
    }


}
