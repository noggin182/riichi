import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindInputComponent } from './wind-input.component';

describe('WindInputComponent', () => {
  let component: WindInputComponent;
  let fixture: ComponentFixture<WindInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
