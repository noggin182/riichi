import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TileComponent } from './components/tile/tile.component';
import { PaletteComponent } from './components/palette/palette.component';
import { TileButtonComponent } from './components/tile-button/tile-button.component';
import { HandComponent } from './components/hand/hand.component';
import { ComputedHandComponent } from './components/computed-hand/computed-hand.component';
import { NamePipe } from './pipes/name.pipe';
import { MeldComponent } from './components/meld/meld.component';
import { WaitsComponent } from './components/waits/waits.component';
import { MahjongComponent } from './components/mahjong/mahjong.component';
import { WinningHandComponent } from './components/winning-hand/winning-hand.component';

@NgModule({
  declarations: [AppComponent, TileComponent, PaletteComponent, TileButtonComponent, HandComponent, ComputedHandComponent, NamePipe, MeldComponent, WaitsComponent, MahjongComponent, WinningHandComponent ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
