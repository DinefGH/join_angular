import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsAddComponent } from './contacts-add.component';

describe('ContactsAddComponent', () => {
  let component: ContactsAddComponent;
  let fixture: ComponentFixture<ContactsAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactsAddComponent]
    });
    fixture = TestBed.createComponent(ContactsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
