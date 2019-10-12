import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputedHandComponent } from './computed-hand.component';

describe('ComputedHandComponent', () => {
  let component: ComputedHandComponent;
  let fixture: ComponentFixture<ComputedHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComputedHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputedHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
