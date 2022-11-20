import { Pipe, PipeTransform } from '@angular/core';
import { State } from '../state';

@Pipe({
    name: 'name'
})
export class NamePipe implements PipeTransform {
    constructor(private state: State) {
    }

    transform(value: {name: [string, string, string]}): string {
      return value.name[this.state.currentLanguage] || value.name[0];
    }

}
