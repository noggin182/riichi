import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    inject,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wind } from '@riichi/common';
import { DiscardsComponent } from "../discards/discards.component";
import { WallSideComponent } from "../wall-side/wall-side.component";
import { HandComponent } from "../hand/hand.component";
import { GameService, PlayerIndex, TileIndex } from '@riichi/game-core';
import { BehaviorSubject } from 'rxjs';
import { TileClickBehaviour, TILE_CLICK_BEHAVIOUR } from '../state/state';

@Component({
    selector: 'rth-seat',
    standalone: true,
    templateUrl: './seat.component.html',
    styleUrls: ['./seat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DiscardsComponent, WallSideComponent, HandComponent]
})
export class SeatComponent {
    @Input() gameService!: GameService;
    @HostBinding('data.attr-seat')
    @Input() seat!: PlayerIndex;
    @Output() tileClick = new EventEmitter<{tileIndex: TileIndex, type: 'split' | 'flip' | 'take'}>();

    protected readonly seats: readonly Wind[] = [Wind.East, Wind.South, Wind.West, Wind.North];
    protected readonly tileClickBehaviour$ = inject<BehaviorSubject<TileClickBehaviour>>(TILE_CLICK_BEHAVIOUR);

    protected readonly windChars: Record<Wind, string> = {
        [Wind.East]:  '東',
        [Wind.South]: '南',
        [Wind.West]:  '西',
        [Wind.North]: '北',
    };
}
