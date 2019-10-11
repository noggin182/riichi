import { Component } from '@angular/core';
import { State } from './state';

@Component({
  selector: 'riichi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'scorer';

  constructor(readonly state: State) {

  }
}
