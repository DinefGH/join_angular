import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardEditTaskComponent } from './board-edit-task.component';

describe('BoardEditTaskComponent', () => {
  let component: BoardEditTaskComponent;
  let fixture: ComponentFixture<BoardEditTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardEditTaskComponent]
    });
    fixture = TestBed.createComponent(BoardEditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
