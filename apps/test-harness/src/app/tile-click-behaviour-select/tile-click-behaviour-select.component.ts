import {
    ChangeDetectionStrategy,
    Component,
    inject,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TileClickBehaviour, TILE_CLICK_BEHAVIOUR } from '../state/state';

@Component({
    selector: 'rth-tile-click-behaviour-select',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tile-click-behaviour-select.component.html',
    styleUrls: ['./tile-click-behaviour-select.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileClickBehaviourSelectComponent {

    protected readonly tileClickBehaviour$ = inject<BehaviorSubject<TileClickBehaviour>>(TILE_CLICK_BEHAVIOUR);

    protected readonly behaviours = [
        {name: 'Split After', value : TileClickBehaviour.SplitAfter},
        {name: 'Split Before', value : TileClickBehaviour.SplitBefore},
        {name: 'Take',  value : TileClickBehaviour.Take},
        {name: 'Flip',  value : TileClickBehaviour.Flip},
        {name: 'Discard',  value : TileClickBehaviour.Discard},
    ]
}
