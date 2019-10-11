import { PipeTransform, Pipe } from '@angular/core';
import { tileToUnicode } from '@riichi/utils';
import { Tile } from '@riichi/definitions';

@Pipe({
    name: 'tile',
    pure: true,
})
export class TilePipe implements PipeTransform {
    transform(tile: Tile | Tile[]) {
        return Array.isArray(tile) ? tile.map(tileToUnicode).join('') : tileToUnicode(tile);
    }

}