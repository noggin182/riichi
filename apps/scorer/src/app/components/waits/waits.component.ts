import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { State, WinningResult } from '../../state';
import { Tile } from '@riichi/common';

@Component({
    selector: 'scorer-waits',
    templateUrl: './waits.component.html',
    styleUrls: ['./waits.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaitsComponent {
    constructor(readonly state: State) {
    }

    @Input() waits: {tile: Tile, result: WinningResult}[];
}
