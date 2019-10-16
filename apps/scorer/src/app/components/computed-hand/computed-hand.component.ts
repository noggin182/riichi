import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, OnChanges } from '@angular/core';
import { CountedYaku, CountedFu, WinningHand, calculatePoints, PaymentInfo, Wind } from '@riichi/common';
import { State } from '../../state';

@Component({
    selector: 'scorer-computed-hand',
    templateUrl: './computed-hand.component.html',
    styleUrls: ['./computed-hand.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ComputedHandComponent implements OnChanges {

    constructor(readonly state: State) { }

    @Input() index: number;
    @Input() winningHand: WinningHand;
    @Input() yaku: CountedYaku[];
    @Input() fu: CountedFu[];

    totalFan: number;
    totalFu: number;
    payment: PaymentInfo;

    ngOnChanges() {
        this.totalFan = this.yaku.reduce((total, yaku) => total + yaku.fan + yaku.extras.length, 0);
        this.totalFu = this.fu.reduce((total, fu) => total + fu.definition.fu, 0);
        this.payment = calculatePoints(this.winningHand, this.yaku, this.fu);
    }

}
