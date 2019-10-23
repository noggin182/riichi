import { Pipe, PipeTransform } from '@angular/core';
import { Wind } from '@riichi/common';

@Pipe({
    name: 'wind'
})
export class WindPipe implements PipeTransform {
    transform(wind: Wind): string {
        switch (wind) {
            case Wind.East:  return 'East';
            case Wind.South: return 'South';
            case Wind.West:  return 'West';
            case Wind.North: return 'North';
        }
        console.error('Unknown wind: ', wind);
        return `Wind[${wind}]`;
    }

}
