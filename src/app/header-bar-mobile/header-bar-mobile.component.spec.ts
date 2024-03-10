import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBarMobileComponent } from './header-bar-mobile.component';

describe('HeaderBarMobileComponent', () => {
  let component: HeaderBarMobileComponent;
  let fixture: ComponentFixture<HeaderBarMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderBarMobileComponent]
    });
    fixture = TestBed.createComponent(HeaderBarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
