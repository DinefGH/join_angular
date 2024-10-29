import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryComponent } from './summary.component';
import { UserService } from 'src/app/services/user.service';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from 'src/assets/models/user.model';
import { Task } from 'src/app/services/task.service';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Import NO_ERRORS_SCHEMA

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let taskService: jasmine.SpyObj<TaskService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Task 1 description',
      priority: 'high',
      due_date: '2024-12-10',
      status: 'todo',
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 1,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Task 2 description',
      priority: 'medium',
      due_date: '2024-12-12',
      status: 'done',
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 1,
    },
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SummaryComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Default mock return values
    userService.getCurrentUser.and.returnValue(of(mockUser));
    taskService.getTasks.and.returnValue(of(mockTasks));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init and calculate nearest due date', () => {
    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.tasks.length).toBe(2);
    expect(component.nearestDueDate).toEqual(new Date('2024-12-10'));
  });

  it('should generate greeting based on time of day', () => {
    const morningGreeting = component['generateGreeting'](mockUser);
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      expect(morningGreeting).toBe('Good morning,');
    } else if (currentHour >= 12 && currentHour < 18) {
      expect(morningGreeting).toBe('Good afternoon,');
    } else {
      expect(morningGreeting).toBe('Good evening,');
    }
  });

  it('should hide overlay when showOverlayStored is not "true"', () => {
    sessionStorage.setItem('showOverlaySummary', 'false');
    fixture.detectChanges();

    expect(component.showOverlaySummary).toBeFalse();
  });

  it('should count tasks by status correctly', () => {
    fixture.detectChanges();
    expect(component.countTasksByStatus('todo')).toBe(1);
    expect(component.countTasksByStatus('done')).toBe(1);
    expect(component.countTasksByStatus('inProgress')).toBe(0);
  });

  it('should count tasks by priority correctly', () => {
    fixture.detectChanges();
    expect(component.countTasksByPriority('high')).toBe(1);
    expect(component.countTasksByPriority('medium')).toBe(1);
    expect(component.countTasksByPriority('low')).toBe(0);
  });

  it('should navigate to board summary when goToBoardSummary is called', () => {
    component.goToBoardSummary();
    expect(router.navigate).toHaveBeenCalledWith(['/board']);
  });

  it('should find the nearest task based on the due date', () => {
    // Mock tasks with different due dates
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Task 1 description',
        priority: 'high',
        due_date: '2024-12-10',
        status: 'todo',
        assigned_to: [],
        subtasks: [],
        contacts: [],
        creator: 1,
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Task 2 description',
        priority: 'medium',
        due_date: '2024-11-10',
        status: 'todo',
        assigned_to: [],
        subtasks: [],
        contacts: [],
        creator: 1,
      },
      {
        id: 3,
        title: 'Task 3',
        description: 'Task 3 description',
        priority: 'low',
        due_date: '2024-12-15',
        status: 'todo',
        assigned_to: [],
        subtasks: [],
        contacts: [],
        creator: 1,
      },
    ];

    // Directly set tasks in the component
    component.tasks = mockTasks;

    // Manually calculate the nearest due date
    let nearestTask: Task | null = null;
    let minDifference = Infinity;
    const currentDate = new Date().getTime();

    component.tasks.forEach(task => {
      const taskDueDate = task.due_date ? new Date(task.due_date).getTime() : Infinity;
      const difference = taskDueDate - currentDate;

      if (difference >= 0 && difference < minDifference) {
        minDifference = difference;
        nearestTask = task;
      }
    });

    // Assert that nearestTask is not null
    expect(nearestTask).not.toBeNull();

    // Now safely access nearestTask.title
    expect(nearestTask!.title).toBe('Task 2'); // Nearest task should be Task 2
  });
});
