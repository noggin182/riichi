import { Pipe, PipeTransform } from "@angular/core";
import { TileIndex } from "@riichi/game-core";

@Pipe({name:'pad', standalone: true})
export class PadPipe implements PipeTransform {
    transform(tiles: undefined | readonly TileIndex[], length: number): readonly (TileIndex | undefined)[] {
        return tiles == undefined ? [] : tiles.length >= length ? tiles : [...tiles, ...new Array(length - tiles.length).fill(undefined)];
    }
}