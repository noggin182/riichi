import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, OnChanges } from '@angular/core';
import { Mahjong } from '@riichi/definitions';
import { CountedYaku, CountedFu } from '@riichi/utils';
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
    @Input() mahjong: Mahjong;
    @Input() yakus: CountedYaku[];
    @Input() fu: CountedFu[];

    totalFan: number;
    totalFu: number;

    ngOnChanges() {
        this.totalFan = this.yakus.reduce((total, yaku) => total + yaku.fan + yaku.extras.length, 0);
        this.totalFu = this.fu.reduce((total, fu) => total + fu.definition.fu, 0);
    }

}
