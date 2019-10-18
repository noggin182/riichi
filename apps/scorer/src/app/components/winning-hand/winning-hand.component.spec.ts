import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinningHandComponent } from './winning-hand.component';

describe('WinningHandComponent', () => {
  let component: WinningHandComponent;
  let fixture: ComponentFixture<WinningHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinningHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinningHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
