import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TileComponent } from './components/tile/tile.component'

@NgModule({
  declarations: [AppComponent, TileComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatToolbarModule, MatButtonToggleModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
