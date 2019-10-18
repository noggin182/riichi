import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FinalMeld } from '@riichi/common';

@Component({
    selector: 'scorer-meld',
    templateUrl: './meld.component.html',
    styleUrls: ['./meld.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeldComponent {
    @Input() meld: FinalMeld;

    @Input() size: 'normal' | 'small' | 'tiny' = 'normal';
}
