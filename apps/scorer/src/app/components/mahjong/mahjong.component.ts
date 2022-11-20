import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {  Mahjong } from '@riichi/common';


@Component({
  selector: 'scorer-mahjong',
  templateUrl: './mahjong.component.html',
  styleUrls: ['./mahjong.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MahjongComponent {
    @Input() mahjong: Mahjong | undefined;
}
