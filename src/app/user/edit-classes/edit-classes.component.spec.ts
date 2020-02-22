import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClassesComponent } from './edit-classes.component';

describe('EditClassesComponent', () => {
  let component: EditClassesComponent;
  let fixture: ComponentFixture<EditClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
