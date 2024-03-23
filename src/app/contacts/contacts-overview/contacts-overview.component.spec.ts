import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsOverviewComponent } from './contacts-overview.component';

describe('ContactsOverviewComponent', () => {
  let component: ContactsOverviewComponent;
  let fixture: ComponentFixture<ContactsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactsOverviewComponent]
    });
    fixture = TestBed.createComponent(ContactsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
