import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryComponent } from './summary.component';
import { UserService } from 'src/app/services/user.service';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from 'src/assets/models/user.model';
import { Task } from 'src/app/services/task.service';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let taskService: jasmine.SpyObj<TaskService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Task 1 description', priority: 'high', due_date: '2024-12-10', status: 'todo', assigned_to: [], subtasks: [], contacts: [], creator: 1 },
    { id: 2, title: 'Task 2', description: 'Task 2 description', priority: 'medium', due_date: '2024-12-12', status: 'done', assigned_to: [], subtasks: [], contacts: [], creator: 1 },
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
        { provide: Router, useValue: routerSpy }
      ]
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

  it('should show overlay when showOverlayStored is "true" in sessionStorage', () => {
    sessionStorage.setItem('showOverlaySummary', 'true');
    fixture.detectChanges();

    expect(component.showOverlaySummary).toBeTrue();

    // Simulate timeout behavior to hide the overlay
    jasmine.clock().install();
    jasmine.clock().tick(5001); // Simulate passing of 5000ms
    expect(component.showOverlaySummary).toBeFalse();
    jasmine.clock().uninstall();
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
});
