import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabTableComponent } from './collab-table.component';

describe('CollabTableComponent', () => {
  let component: CollabTableComponent;
  let fixture: ComponentFixture<CollabTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollabTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
