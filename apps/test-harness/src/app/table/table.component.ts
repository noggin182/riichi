import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatComponent } from "../seat/seat.component";
import { GameService, PlayerIndex } from '@riichi/game-core';

@Component({
    selector: 'rth-table',
    standalone: true,
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, SeatComponent]
})
export class TableComponent {
    @Input() gameService!: GameService;
    protected readonly seatIndexes: readonly PlayerIndex[] = [0, 1, 2, 3];
}
