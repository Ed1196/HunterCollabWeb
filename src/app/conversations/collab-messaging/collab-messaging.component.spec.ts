import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabMessagingComponent } from './collab-messaging.component';

describe('CollabMessagingComponent', () => {
  let component: CollabMessagingComponent;
  let fixture: ComponentFixture<CollabMessagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollabMessagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
