import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from '@riichi/components';
import { GameService, PlayerIndex, TileIndex } from '@riichi/game-core';

@Component({
    selector: 'rth-hand',
    standalone: true,
    imports: [CommonModule, TileComponent],
    templateUrl: './hand.component.html',
    styleUrls: ['./hand.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandComponent implements OnChanges {
    @Input() gameService!: GameService;
    @Input() seat!: PlayerIndex;
    @Output() tileClick = new EventEmitter<TileIndex>();

    protected slots!: number[];

    ngOnChanges(): void {
        this.slots = new Array(14).fill(1).map((_, i) => i);
    }

}
