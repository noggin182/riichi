import { Injectable } from "@angular/core";
import { Tile, Meld, Mahjong, Wind } from '@riichi/definitions';
import { countYaku, WinningHand, checkForMahjong, calculateFu, CountedYaku, CountedFu } from '@riichi/utils';

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

    winningResults: {
        mahjong: Mahjong,
        yakus: CountedYaku[],
        fu: CountedFu[]
    }[];

    roundInfo = {
        firstRound: false,
        selfDrawn: true,
        selfDrawnAfterKan: false,
        robbedFromKan: false,
        lastTile: false,

        riichi: false,
        doubleRiichi: false,
        oneShot: false,
        prevailingWind: Wind.East,
        seatedWind: Wind.East,

        doraIndicator: [] as Tile[]
    };

    hand: {
        concealed: Tile[];
        melds: Meld[]
    } = {concealed: [], melds: []}

    appendTile(tile: Tile) {
        if (this.appendStyle === AppendStyle.Concealed) {
            this.hand.concealed.push(tile);
        }

        const effectiveTiles = this.hand.concealed.length + this.hand.melds.length * 3;
        if (effectiveTiles === 14) {
            this.winningResults = checkForMahjong(this.hand.concealed, this.hand.melds).map(m => {
                const winningHand = this.buildWinningHand(m, this.hand.concealed[this.hand.concealed.length - 1]);
                return {
                    mahjong: m,
                    yakus: countYaku(winningHand),
                    fu: calculateFu(winningHand)
                };
            });
        }
    }

    buildWinningHand(mahjong: Mahjong, winningTile: Tile) {
        const winningHand = new WinningHand(mahjong, winningTile);

        winningHand.firstRound = this.roundInfo.firstRound;
        winningHand.selfDrawn = this.roundInfo.selfDrawn;
        winningHand.selfDrawnAfterKan = this.roundInfo.selfDrawnAfterKan;
        winningHand.robbedFromKan = this.roundInfo.robbedFromKan;
        winningHand.lastTile = this.roundInfo.lastTile;

        winningHand.riichi = this.roundInfo.riichi;
        winningHand.doubleRiichi = this.roundInfo.doubleRiichi;
        winningHand.oneShot = this.roundInfo.oneShot;
        winningHand.prevailingWind = this.roundInfo.prevailingWind;
        winningHand.seatedWind = this.roundInfo.seatedWind;

        winningHand.doraIndicator = this.roundInfo.doraIndicator;

        return winningHand;
    }
}