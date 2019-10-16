import { Injectable } from '@angular/core';
import { Mahjong, Hand, Tile, Wind } from '@riichi/common';
import { countYaku, WinningHand, checkForMahjong, calculateFu, CountedYaku, CountedFu } from '@riichi/common';

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
    winningTile: Tile;
    winningResults: {
        winningHand: WinningHand,
        yaku: CountedYaku[],
        fu: CountedFu[]
    }[];
    tileId = 1;

    roundInfo = {
        firstRound: false,
        selfDrawn: true,
        selfDrawnAfterKan: false,
        robbedFromKan: false,
        lastTile: false,

        riichi: true,
        doubleRiichi: false,
        oneShot: true,
        prevailantWind: Wind.East,
        seatWind: Wind.East,

        doraIndicator: [] as readonly Tile[],
        uraDoraIndicator: [] as readonly Tile[]
    };

    hand: Hand = {concealedTiles: [], melds: []};

    appendTile(tile: Tile) {
        const effectiveTiles = this.hand.concealedTiles.length + this.hand.melds.length * 3;
        if (effectiveTiles === 13) {
            this.winningTile = tile;
            this.winningResults = checkForMahjong(this.hand, tile, Wind.East, Wind.East).map(m => {
                const winningHand = this.buildWinningHand(m, this.winningTile);
                return {
                    winningHand: winningHand,
                    yaku: countYaku(winningHand),
                    fu: calculateFu(winningHand)
                };
            });
        } else {
            if (this.appendStyle === AppendStyle.Concealed) {
                this.hand.concealedTiles.push({
                    id: this.tileId++,
                    kind: tile.kind,
                    rank: tile.rank
                });
            }
        }
    }

    buildWinningHand(mahjong: Mahjong, winningTile: Tile) {
        const winningHand = new WinningHand(mahjong, winningTile);

        winningHand.firstRound = this.roundInfo.firstRound;
        winningHand.winningTileFromWind = Wind.East;
        winningHand.selfDrawnAfterKan = this.roundInfo.selfDrawnAfterKan;
        winningHand.robbedFromKan = this.roundInfo.robbedFromKan;
        winningHand.lastTile = this.roundInfo.lastTile;

        winningHand.riichi = this.roundInfo.riichi;
        winningHand.doubleRiichi = this.roundInfo.doubleRiichi;
        winningHand.oneShot = this.roundInfo.oneShot;
        winningHand.prevalentWind = this.roundInfo.prevailantWind;
        winningHand.seatWind = this.roundInfo.seatWind;

        winningHand.doraIndicator = this.roundInfo.doraIndicator;
        winningHand.uraDoraIndicator = this.roundInfo.uraDoraIndicator;

        return winningHand;
    }
}
