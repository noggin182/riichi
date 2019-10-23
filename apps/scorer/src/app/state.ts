import { Injectable } from '@angular/core';
import { Hand, Tile, handFromNotation, getPossibleMahjongs, ScoredHand, WinState, getWinningScore, checkForMahjong, Wind } from '@riichi/common';

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
    possibleWaits: {tile: Tile, result: ScoredHand}[];
    winningTile: Tile;
    winningResults: ScoredHand[];
    tileId = 1;

    roundInfo: WinState = {
        firstRound: false,
        selfDrawnAfterKan: false,
        robbedFromKan: false,
        lastTile: false,

        riichi: false,
        doubleRiichi: false,
        oneShot: false,
        prevalentWind: Wind.East,
        seatWind: Wind.East,
        winningTileFromWind: Wind.East,

        doraIndicator: [],
        uraDoraIndicator:  []
    };

    hand: Hand = {concealedTiles: [], melds: []};

    appendTile(tile: Tile) {
        if (this.appendStyle === AppendStyle.Concealed) {
            this.hand.concealedTiles.push({
                id: this.tileId++,
                kind: tile.kind,
                rank: tile.rank
            });
        }
        this.checkHand();
    }

    checkHand() {
        const effectiveTiles = this.hand.concealedTiles.length + this.hand.melds.length * 3;
        this.winningResults = [];
        this.possibleWaits = [];
        if (effectiveTiles === 13) {
            this.possibleWaits = getPossibleMahjongs(this.hand).map(r => ({
                tile: r.tile,
                result: r.mahjongs.map(m => getWinningScore(m, this.roundInfo)).sort(this.sortByBest)[0]
            }));
        } else if (effectiveTiles === 14) {
            this.winningTile = this.hand.concealedTiles[this.hand.concealedTiles.length - 1];
            this.winningResults = checkForMahjong(this.hand, this.roundInfo.seatWind, this.roundInfo.winningTileFromWind).map(m => getWinningScore(m, this.roundInfo)).sort(this.sortByBest);
        }
    }

    setHand(notation: string) {
        try {
            this.hand = handFromNotation(notation);
            this.checkHand();
        } catch (e) {
            console.error(e);
        }
    }

    sortByBest(result1: ScoredHand, result2: ScoredHand) {
        return result1.payment.basePoints - result2.payment.basePoints;
    }
}
