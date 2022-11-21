import { Injectable } from '@angular/core';
import {
    Hand,
    Tile,
    handFromNotation,
    getPossibleMahjongs,
    ScoredHand,
    WinState,
    getWinningScore,
    checkForMahjong,
    Wind,
    RelativeSeat,
    relativeSeatToWind,
    MeldKind
} from '@riichi/common';

export enum AppendStyle {
    Concealed,
    Chi,
    Pon,
    Kan,
    AddedKan,
    ConcealedKan
}

@Injectable({providedIn: 'root'})
export class State {
    currentLanguage: 0 | 1 = 0;
    blackTiles = false;
    appendStyle = AppendStyle.Concealed;
    fromSeat = RelativeSeat.Left;
    possibleWaits: {tile: Tile, result: ScoredHand}[] | undefined;
    winningTile: Tile | undefined;
    winningResults: ScoredHand[]| undefined;
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
            this.hand.concealedTiles.push(tile);
        } else if (this.appendStyle === AppendStyle.Chi) {
            // TODO
        } else if (this.appendStyle === AppendStyle.ConcealedKan) {
            const tiles = [tile, tile, tile, tile];
            this.hand.melds.push({
                claimedTile: null,
                from: this.roundInfo.seatWind,
                kind: MeldKind.ConcealedKan,
                tiles: tiles
            });
        } else {
            const tiles = [tile, tile, tile];
            if (this.appendStyle !== AppendStyle.Pon) {
                tiles.push(tile);
            }
            const turnedTile = this.fromSeat === RelativeSeat.Left  ? 0
                             : this.fromSeat === RelativeSeat.Right ? tiles.length - 1
                             : 1;
            this.hand.melds.push({
                claimedTile: tiles[turnedTile],
                from: relativeSeatToWind(this.roundInfo.seatWind, this.fromSeat),
                kind: MeldKind.Pon,
                tiles: tiles
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
            || Math.abs(result2.totalHan) - Math.abs(result1.totalHan)
            || (result1.totalHan > 0 && result2.totalFu - result1.totalFu)
            || result1.mahjong.finalTile.localeCompare(result2.mahjong.finalTile);
    }
}
