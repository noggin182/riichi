import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileButtonComponent } from './tile-button.component';

describe('TileButtonComponent', () => {
  let component: TileButtonComponent;
  let fixture: ComponentFixture<TileButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
