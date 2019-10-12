import { Component, OnInit } from '@angular/core';
import { State } from '../../state';

@Component({
  selector: 'scorer-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {

  constructor(readonly state: State) {
    
  }

  ngOnInit() {
  }

}
