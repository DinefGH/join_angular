import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardEditTaskComponent } from './board-edit-task.component';

describe('BoardEditTaskComponent', () => {
  let component: BoardEditTaskComponent;
  let fixture: ComponentFixture<BoardEditTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardEditTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardEditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger component initialization
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});