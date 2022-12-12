import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from '@riichi/components';
import { GameService, PlayerIndex } from '@riichi/game-core';
import { PadPipe } from '../pipes/pad.pipe';

@Component({
    selector: 'rth-discards',
    standalone: true,
    imports: [CommonModule, TileComponent, PadPipe],
    templateUrl: './discards.component.html',
    styleUrls: ['./discards.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscardsComponent {
    @HostBinding('attr.data-seat')
    @Input() seat!: PlayerIndex;
    @Input() gameService!: GameService;
}
