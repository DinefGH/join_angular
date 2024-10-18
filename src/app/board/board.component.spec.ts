import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Task } from 'src/app/services/task.service'; // Adjust the path as necessary

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let addContactService: jasmine.SpyObj<AddContactService>;

  // Define mock data for tasks
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description of Task 1',
      priority: 'high',
      due_date: '2024-12-01',
      category: 1,
      assigned_to: [1, 2],
      subtasks: [
        { id: 1, text: 'Subtask 1', completed: false },
        { id: 2, text: 'Subtask 2', completed: true }
      ],
      status: 'todo',
      contacts: [1, 2],
      creator: 1
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description of Task 2',
      priority: 'medium',
      due_date: '2024-12-02',
      category: 2,
      assigned_to: [3],
      subtasks: [
        { id: 3, text: 'Subtask 3', completed: false }
      ],
      status: 'inProgress',
      contacts: [3],
      creator: 2
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description of Task 3',
      priority: 'low',
      due_date: '2024-12-03',
      category: 1,
      assigned_to: [2],
      subtasks: [],
      status: 'done',
      contacts: [1],
      creator: 3
    }
  ];

  // Define mock data for categories
  const mockCategories = [
    { id: 1, name: 'Work', color: '#FF0000' },
    { id: 2, name: 'Personal', color: '#00FF00' }
  ];

  // Define mock data for contacts
  const mockContacts = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks', 'updateTask']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    const addContactServiceSpy = jasmine.createSpyObj('AddContactService', ['getContacts']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BoardComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AddContactService, useValue: addContactServiceSpy },
      ],
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    addContactService = TestBed.inject(AddContactService) as jasmine.SpyObj<AddContactService>;

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;

    // Mock return values for services
    taskService.getTasks.and.returnValue(of(mockTasks));
    categoryService.getCategories.and.returnValue(of(mockCategories));
    addContactService.getContacts.and.returnValue(of(mockContacts));

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks and categorize them correctly', () => {
    expect(component.todoTasks.length).toBe(1);
    expect(component.inProgressTasks.length).toBe(1);
    expect(component.doneTasks.length).toBe(1);

    expect(component.todoTasks[0].title).toBe('Task 1');
    expect(component.inProgressTasks[0].title).toBe('Task 2');
    expect(component.doneTasks[0].title).toBe('Task 3');
  });

  it('should load categories correctly', () => {
    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Work');
    expect(component.categories[1].name).toBe('Personal');
  });

  it('should load contacts correctly', () => {
    expect(component.contacts.length).toBe(2);
    expect(component.contacts[0].name).toBe('John Doe');
    expect(component.contacts[1].name).toBe('Jane Smith');
  });

  it('should change task status and update the task', () => {
    const task = component.todoTasks[0]; // Task 1 is in the 'todo' status
    const newStatus = 'inProgress';

    taskService.updateTask.and.returnValue(of({ ...task, status: newStatus }));

    component.changeStatus(task, newStatus);
    expect(taskService.updateTask).toHaveBeenCalledWith(task.id!, { ...task, status: newStatus });
    expect(component.inProgressTasks.length).toBe(2);
    expect(component.todoTasks.length).toBe(0);
  });

  it('should handle task drag and drop', () => {
    const task = component.todoTasks[0]; // Task 1 is in 'todo'
    const newStatus = 'done';

    spyOn(component, 'getStatusFromContainerId').and.returnValue(newStatus);
    taskService.updateTask.and.returnValue(of({ ...task, status: newStatus }));

    component.draggedTask = task;
    component.drop({
      previousContainer: { data: component.todoTasks },
      container: { id: 'doneContainer', data: component.doneTasks, element: {} as any },
    } as any);

    expect(taskService.updateTask).toHaveBeenCalledWith(task.id!, { ...task, status: newStatus });
    expect(component.todoTasks.length).toBe(0);
    expect(component.doneTasks.length).toBe(2);
  });

  it('should filter tasks by search term', () => {
    component.searchTerm = 'Task 1';
    component.searchTasks();

    expect(component.todoTasks.length).toBe(1);
    expect(component.todoTasks[0].title).toBe('Task 1');

    expect(component.inProgressTasks.length).toBe(0);
    expect(component.doneTasks.length).toBe(0);
  });

  it('should open and close the task overlay', () => {
    const task = component.todoTasks[0];
    component.openTaskOverlay(task);

    expect(component.selectedTask).toBe(task);
    expect(component.isOverlayVisibleTask).toBeTrue();

    component.closeTaskOverlay();

    expect(component.selectedTask).toBeNull();
    expect(component.isOverlayVisibleTask).toBeFalse();
  });
});
