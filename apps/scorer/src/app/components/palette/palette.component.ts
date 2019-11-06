import { Component, ViewEncapsulation } from '@angular/core';
import { createDummySetOfTiles, RelativeSeat } from '@riichi/common';
import { State, AppendStyle } from '../../state';

@Component({
    selector: 'scorer-palette',
    templateUrl: './palette.component.html',
    styleUrls: ['./palette.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PaletteComponent {

    constructor(readonly state: State) { }

    AppendStyle = AppendStyle;
    allTiles = createDummySetOfTiles();

    styles = [
        {caption: 'Concealed',  value: AppendStyle.Concealed},
        {caption: 'Chi',        value: AppendStyle.Chi},
        {caption: 'Pon',        value: AppendStyle.Pon},
        {caption: 'Kan',        value: AppendStyle.Kan},
        // {caption: 'Added Kan',  value: AppendStyle.AddedKan},
        {caption: 'Concealed Kan', value: AppendStyle.ConcealedKan}
    ];

    claims = [
        {caption: 'From left',     value: RelativeSeat.Left},
        {caption: 'From opposite', value: RelativeSeat.Opposite},
        {caption: 'From right',    value: RelativeSeat.Right}
    ];

    updateAppendStyle(event: {target: HTMLInputElement }) {
        if (event.target.checked) {
            this.state.appendStyle = +event.target.value as AppendStyle;
        }
    }

}
