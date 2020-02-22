import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollabComponent } from './edit-collab.component';

describe('EditCollabComponent', () => {
  let component: EditCollabComponent;
  let fixture: ComponentFixture<EditCollabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCollabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
