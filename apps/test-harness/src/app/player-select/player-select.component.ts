import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerIndex } from '@riichi/game-core';

@Component({
    selector: 'rth-player-select',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './player-select.component.html',
    styleUrls: ['./player-select.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerSelectComponent {

    @Input() playerIndex: PlayerIndex = 0;
    @Output() playerIndexChange = new EventEmitter<PlayerIndex>();

    protected readonly playerNames: readonly string[] = [ 'Player 1', 'Player 2', 'Player 3', 'Player4' ];
    protected clickPlayer(index: number) {
        this.playerIndexChange.emit(index as unknown as PlayerIndex);
    }
}
