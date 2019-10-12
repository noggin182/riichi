import { Mahjong, Tile, Wind, TileSuit } from '@riichi/definitions';
import { makeTile } from './tile-utils';

export class WinningHand {
    
    constructor(readonly mahjong: Readonly<Mahjong>, readonly winningTile: Tile) {
        this.sets = [...mahjong.melds.map(m => m.tiles), ...mahjong.concealed];
        this.chis = this.sets.filter(s => s[0] !== s[1]);
        this.pons = this.sets.filter(s => s[0] === s[1]);
        this.pairTile = mahjong.pair ? mahjong.pair[0] : Tile.Blank;
        this.allTiles = [].concat(...this.sets, ...(mahjong.pair || []));
    }

    readonly allTiles: Readonly<Tile[]>;
    readonly pairTile: Readonly<Tile>;
    readonly sets: Readonly<Tile[][]>;
    readonly chis: Readonly<Tile[][]>;
    readonly pons: Readonly<Tile[][]>;

    firstRound: boolean;
    selfDrawn: boolean;
    selfDrawnAfterKan: boolean;
    robbedFromKan: boolean;
    lastTile: boolean;

    riichi: boolean;
    doubleRiichi: boolean;
    oneShot: boolean;
    prevailingWind: Wind = -1;
    seatedWind: Wind = -1;

    doraIndicator: Tile[];

    get prevailingWindTile() { return makeTile(TileSuit.Wind, this.prevailingWind); }
    get seatedWindTile()     { return makeTile(TileSuit.Wind, this.seatedWind); }
}