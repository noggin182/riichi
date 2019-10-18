import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitsComponent } from './waits.component';

describe('WaitsComponent', () => {
  let component: WaitsComponent;
  let fixture: ComponentFixture<WaitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
