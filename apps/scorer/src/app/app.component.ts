import { Component, ViewEncapsulation } from '@angular/core';
import { State } from './state';
import { handFromNotation } from '@riichi/common';

@Component({
    selector: 'scorer-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    title = 'scorer';

    constructor(readonly state: State) {
    }

    handFromNotation = handFromNotation;
}
