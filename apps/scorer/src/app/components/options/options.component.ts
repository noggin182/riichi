import { Component, ViewEncapsulation } from '@angular/core';
import { State } from '../../state';
import { handFromNotation } from '@riichi/common';

@Component({
    selector: 'scorer-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OptionsComponent {
    constructor(readonly state: State) {
    }

    handFromNotation = handFromNotation;
}
