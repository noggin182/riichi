import { Component, Input } from '@angular/core';
import { WinningHand } from '@riichi/common';

@Component({
    selector: 'scorer-winning-hand',
    templateUrl: './winning-hand.component.html',
    styleUrls: ['./winning-hand.component.scss']
})
export class WinningHandComponent {
    @Input() hand: WinningHand;
}
