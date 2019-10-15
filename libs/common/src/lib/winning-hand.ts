import { makeTile, getValueFromTile, getSuitFromTile } from './tile-utils';
import { Tile, Wind, TileSuit } from './definitions/tiles';
import { Mahjong } from './definitions/mahjong-definition';

export class WinningHand {

    constructor(readonly mahjong: Readonly<Mahjong>, readonly winningTile: Tile) {
        this.sets = [...mahjong.melds.map(m => m.tiles), ...mahjong.concealed];
        this.chis = this.sets.filter(s => s[0] !== s[1]);
        this.pons = this.sets.filter(s => s[0] === s[1]);
        this.pairTile = mahjong.pair ? mahjong.pair[0] : Tile.Blank;
        this.allTiles = [].concat(...this.sets, ...(mahjong.pair || []));

        this.isSevenPairs = this.sets.length === 7;
        this.isThirteenOrphans = this.sets.length === 1;

        this.isPinfu = !this.pons.length
                    && this.chis.some(s => (s[0] === this.winningTile && getValueFromTile(s[2]) !== 7)
                                        || (s[2] === this.winningTile && getValueFromTile(s[0]) !== 3))
                    && getSuitFromTile(this.pairTile) !== TileSuit.Dragon
                    && this.pairTile !== this.prevailingWindTile
                    && this.pairTile !== this.seatedWindTile;
    }

    readonly allTiles: Readonly<Tile[]>;
    readonly pairTile: Readonly<Tile>;
    readonly sets: Readonly<Tile[][]>;
    readonly chis: Readonly<Tile[][]>;
    readonly pons: Readonly<Tile[][]>;

    readonly isSevenPairs: boolean;
    readonly isThirteenOrphans: boolean;
    readonly isPinfu: boolean;

    firstRound: boolean;
    selfDrawnAfterKan: boolean;
    robbedFromKan: boolean;
    lastTile: boolean;

    riichi: boolean;
    doubleRiichi: boolean;
    oneShot: boolean;
    prevailingWind: Wind = -1;
    seatedWind: Wind = -1;
    winningTileFromWind: Wind = -1;

    doraIndicator: Tile[];

    get selfDrawn() { return this.winningTileFromWind === this.seatedWind; }
    get prevailingWindTile() { return makeTile(TileSuit.Wind, this.prevailingWind); }
    get seatedWindTile()     { return makeTile(TileSuit.Wind, this.seatedWind); }
}
