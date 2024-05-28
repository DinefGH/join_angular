import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTaskOverlayComponent } from './board-task-overlay.component';

describe('BoardTaskOverlayComponent', () => {
  let component: BoardTaskOverlayComponent;
  let fixture: ComponentFixture<BoardTaskOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardTaskOverlayComponent]
    });
    fixture = TestBed.createComponent(BoardTaskOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
