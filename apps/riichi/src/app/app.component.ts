import { Component } from '@angular/core';
import { handFromNotation, handToUnicode, countYaku, checkForMahjong } from '@riichi/utils';
import { Tile, Mahjong, Wind } from '@riichi/definitions';
import { WinningHand } from 'libs/utils/src/lib/winning-hand';

@Component({
    selector: 'riichi-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    notation = "P1 P2 P3 M5 M5 M5 S6 S7 S8 E E E C C";
    hand: Tile[];

    handToUnicode = handToUnicode;
    mahjongs: Mahjong[];

    constructor() {
        this.update();
    }
    
    update() {
        const hand = handFromNotation(this.notation.toUpperCase().trim());
        if (hand.every(t => t && !isNaN(t)) || hand.length === 13 || hand.length === 14) {
            this.hand = hand;

            if (hand.length === 14) {
                this.mahjongs = checkForMahjong(hand, [])
            }
            
            // this.yaku = countYaku()
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
}
