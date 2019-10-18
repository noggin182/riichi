import { Mahjong, FinalMeldKind, FinalMeld } from './definitions/hand';
import { Tile, TileKind, Wind, TileName } from './definitions/tile';
import { getTileName, dummyBlankTile, sortTiles } from './tile-utils';
import { areSimilarTiles, isDragon } from './tile-checks';

function isClosedMeld(meld: FinalMeld) {
    return meld.kind === FinalMeldKind.ClosedSet || meld.kind === FinalMeldKind.ClosedKan;
}

export class WinningHand {
    constructor(readonly mahjong: Readonly<Mahjong>, readonly winningTile: Tile) {
        this.isSevenPairs = mahjong.melds.length === 7;
        this.isThirteenOrphans = mahjong.melds.length === 1 && mahjong.melds[0].tiles.length === 14;
        this.isOpen = mahjong.melds.some(m => !m.tiles.includes(winningTile) && !isClosedMeld(m));

        this.melds = mahjong.melds.map(m => ({
            kind: m.kind,
            from: m.from,
            claimedTile: m.claimedTile,
            tiles: m.tiles.slice().sort(sortTiles)
        }));

        if (this.isSevenPairs || this.isThirteenOrphans) {
            this.sets = [];
            this.chis = [];
            this.pons = [];
            this.concealed = [];
        } else {
            this.sets = this.melds.map(m => m.tiles).filter(s => s.length !== 2);
            this.chis = this.sets.filter(s => !areSimilarTiles(s[0], s[1]));
            this.pons = this.sets.filter(s =>  areSimilarTiles(s[0], s[1]));
            this.concealed = mahjong.melds.filter(m => isClosedMeld(m) && m.tiles.length > 2).map(m => m.tiles);
        }

        const rawPair = !this.isSevenPairs && mahjong.melds.map(m => m.tiles).find(s => s.length === 2);
        this.pair = rawPair || [dummyBlankTile, dummyBlankTile];
        this.flatChis = this.chis.map(s => s[0]);
        this.flatPons = this.pons.map(s => s[0]);

        this.pairName = getTileName(this.pair[0]);
        this.allTiles = [].concat(...mahjong.melds.map(m => m.tiles)).sort(sortTiles);
        this.valuelessPair = rawPair && !isDragon(rawPair[0]) && !this.isSeatWind(rawPair[0]) && !this.isPrevalentWind(rawPair[0]);
        this.isPinfu = !this.isOpen
                    && !this.pons.length
                    && this.chis.some(s => (s[0] === this.winningTile && s[2].rank !== 7)
                                        || (s[2] === this.winningTile && s[0].rank !== 3))
                    && this.valuelessPair;
    }

    readonly isOpen: boolean;
    readonly allTiles: readonly Tile[];
    readonly pairName: TileName;
    readonly sets: ReadonlyArray<readonly Tile[]>;
    readonly concealed: ReadonlyArray<readonly Tile[]>;
    readonly chis: ReadonlyArray<readonly Tile[]>;
    readonly pons: ReadonlyArray<readonly Tile[]>;
    readonly valuelessPair: boolean;

    readonly melds: readonly FinalMeld[];

    readonly flatChis: readonly Tile[];
    readonly flatPons: readonly Tile[];
    readonly pair:     readonly Tile[];



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
    prevalentWind: Wind = -1;
    seatWind: Wind = -1;
    winningTileFromWind: Wind = -1;

    doraIndicator: readonly Tile[];
    uraDoraIndicator: readonly Tile[];

    get selfDrawn() { return this.winningTileFromWind === this.seatWind; }

    // ======== helper functions ========
    isPrevalentWind = (tile: Tile) => {
        return tile.kind === TileKind.Honor && tile.rank === this.prevalentWind;
    }

    isSeatWind = (tile: Tile) => {
        return tile.kind === TileKind.Honor && tile.rank === this.seatWind;
    }
}
