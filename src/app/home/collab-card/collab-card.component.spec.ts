import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabCardComponent } from './collab-card.component';

describe('CollabCardComponent', () => {
  let component: CollabCardComponent;
  let fixture: ComponentFixture<CollabCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollabCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
