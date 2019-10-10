import { Component } from '@angular/core';
import { handFromNotation, handToUnicode, countYaku, checkForMahjong } from '@riichi/utils';
import { Tile, Mahjong, Wind, allTiles } from '@riichi/definitions';
import { WinningHand } from '@riichi/utils';

@Component({
    selector: 'riichi-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    hand: Tile[] = [];

    handToUnicode = handToUnicode;
    mahjongs: Mahjong[];
    allTiles = allTiles;

    constructor() {
    }
    
    pushToHand(tile: Tile) {
        this.hand.push(tile);
        
        this.mahjongs = [];

        if (this.hand.length === 14) {
            this.mahjongs = checkForMahjong(this.hand, [])
        } else if (this.hand.length === 12) {
        
        }

    }

    countYakus(mahjong: Mahjong) {
        const winning = new WinningHand(mahjong, this.hand[this.hand.length - 1])
        winning.firstRound = false;
        winning.selfDrawn = true;
        winning.selfDrawnAfterKan = false;
        winning.robbedFromKan = false;
        winning.lastTile = false;

        winning.riichi = false;
        winning.doubleRiichi = false;
        winning.oneShot = false;
        winning.prevailingWind = Wind.East;
        winning.seatedWind = Wind.East;

        winning.doraIndicator = [];
        
        return countYaku(winning);
    }

    has4Tiles(tile: Tile) {
        return this.hand.filter(t => t === tile).length >= 4;
    }
}
