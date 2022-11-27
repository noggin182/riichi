import { CommonModule } from '@angular/common';
import { Component, inject, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { Tile, TileIndex, tileToUnicode, Wind } from '@riichi/common';
import { TestServer } from '@riichi/test-server';
import { SimpleAi } from '@riichi/ai';
import { map } from 'rxjs';

@Pipe({name: 'tileUnicode', standalone: true}) export class TilePipe implements PipeTransform {
    transform(value: Tile | '--') {
        return tileToUnicode(value);
    }
}

@Pipe({name: 'pad', standalone: true}) export class PadPipe implements PipeTransform {
    transform<T>(array: T[], length: number, value: T): T[] {
        return array.length >= length
             ? array 
             : [...array, ...new Array(length - array.length).fill(value)];
    }
}

@Pipe({name: 'sort', standalone: true}) export class SortPipe implements PipeTransform {
    transform<T>(array: T[], compareFn?: (a: T, b: T) => number): T[] {
        return array.slice().sort(compareFn);
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, TilePipe, PadPipe, SortPipe],
    providers: [TestServer],
    selector: 'rth-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    protected readonly playerWind = Wind.East;

    protected readonly testServer = inject(TestServer);
    protected readonly connection = this.testServer.connect(this.playerWind);

    protected readonly aiPlayers = [Wind.East, Wind.South, Wind.West, Wind.North]
        .filter (w => w !== this.playerWind)
        .map(wind => new SimpleAi(wind, this.testServer.connect(wind)));

    protected sortTiles$ = this.connection.playerState$.pipe(map(state => (tileA: TileIndex, tileB: TileIndex) => state.deck[tileA]?.localeCompare(state.deck[tileB] ?? '') ?? 0));

    protected drawTile() {
        this.connection.drawTile(-1);
    }

    protected discard(tileIndex: number) {
        this.connection.discard(tileIndex);
    }
}
