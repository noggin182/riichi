import { Injectable } from '@angular/core';
import { Mahjong, Hand, Tile, Wind, handFromNotation, calculateWaits, getPossibleMahjongs, calculatePoints, PaymentInfo } from '@riichi/common';
import { countYaku, WinningHand, checkForMahjong, calculateFu, CountedYaku, CountedFu } from '@riichi/common';

export enum AppendStyle {
    Concealed,
    Chi,
    Pon,
    Kan,
    ClosedKan
}

export interface CountedHand {
    winningHand: WinningHand;
    yaku: CountedYaku[];
    fu: CountedFu[];
    totalFan: number;
    totalFu: number;
    payment: PaymentInfo;
}

export interface WinningResult {
    winningHand: WinningHand;
    yaku: CountedYaku[];
    fu: CountedFu[];
}

@Injectable({providedIn: 'root'})
export class State {
    currentLanguage: 0 | 1 = 0;
    blackTiles = false;
    appendStyle = AppendStyle.Concealed;
    possibleWaits: {tile: Tile, result: CountedHand}[];
    winningTile: Tile;
    winningResults: WinningResult[];
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
                result: this.getResultsForHand(r.mahjongs)[0]
            }));
        } else if (effectiveTiles === 14) {
            this.winningTile = this.hand.concealedTiles[this.hand.concealedTiles.length - 1];
            this.winningResults = this.getResultsForHand(checkForMahjong(this.hand, Wind.East, Wind.East));
        }
    }

    getResultsForHand(mahjongs: Mahjong[]) {
        return mahjongs.map(m => {
            const winningHand = this.buildWinningHand(m, this.winningTile);
            const yaku = countYaku(winningHand);
            const fu = calculateFu(winningHand);
            return {
                winningHand: winningHand,
                yaku: yaku,
                fu: fu,
                totalFan: yaku.reduce((total, y) => total + y.fan + y.extras.length, 0),
                totalFu: fu.reduce((total, f) => total + f.definition.fu, 0),
                payment: calculatePoints(winningHand, yaku, fu)
            };
        });
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

    setHand(notation: string) {
        try {
            this.hand = handFromNotation(notation);
            this.checkHand();
        } catch (e) {
            console.error(e);
        }
    }
}
