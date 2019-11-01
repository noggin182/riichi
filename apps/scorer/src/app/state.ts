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

    roundInfo: {-readonly[P in keyof WinState]: WinState[P]} = {
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
            this.possibleWaits = getPossibleMahjongs(this.hand, this.roundInfo.seatWind).map(r => ({
                tile: r.tile,
                result: r.mahjongs.map(m => getWinningScore(m, this.roundInfo)).sort(this.sortByBest)[0]
            })).sort((a, b) => this.sortByBest(a.result, b.result));
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
        return result2.payment.basePoints - result1.payment.basePoints
            || Math.abs(result2.totalFan) - Math.abs(result1.totalFan)
            || (result1.totalFan > 0 && result2.totalFu - result1.totalFu)
            || result1.mahjong.finalTile.kind - result2.mahjong.finalTile.kind
            || result1.mahjong.finalTile.rank - result2.mahjong.finalTile.rank;
    }
}
