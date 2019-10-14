import { Component, OnInit } from '@angular/core';
import { allTiles } from '@riichi/common';
import { State, AppendStyle } from '../../state';

@Component({
    selector: 'scorer-palette',
    templateUrl: './palette.component.html',
    styleUrls: ['./palette.component.scss']
})
export class PaletteComponent implements OnInit {

    constructor(readonly state: State) { }

    AppendStyle = AppendStyle;
    allTiles = allTiles;

    ngOnInit() {
    }

    updateAppendStyle(event: {target: HTMLInputElement }) {
        console.log(event.target);
        if (event.target.checked) {
            this.state.appendStyle = +event.target.value as AppendStyle;
        }
    }

}
