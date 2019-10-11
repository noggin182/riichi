import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TilePipe } from './tile.pipe';

@NgModule({
  declarations: [AppComponent, TilePipe],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [TilePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
