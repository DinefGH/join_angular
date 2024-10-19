import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardTaskOverlayComponent } from './board-task-overlay.component';
import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { SubtaskService } from 'src/app/services/subtask.service';
import { of } from 'rxjs';
import { Task, Subtask } from 'src/app/services/task.service'; // Adjust the import paths as necessary
import { Contact } from 'src/assets/models/contact.model';
import { Category } from 'src/app/services/category.service';

describe('BoardTaskOverlayComponent', () => {
  let component: BoardTaskOverlayComponent;
  let fixture: ComponentFixture<BoardTaskOverlayComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let addContactService: jasmine.SpyObj<AddContactService>;
  let subtaskService: jasmine.SpyObj<SubtaskService>;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description of Task 1',
      priority: 'high',
      status: 'todo',
      subtasks: [
        { id: 1, text: 'Subtask 1', completed: false },
        { id: 2, text: 'Subtask 2', completed: true }
      ],
      assigned_to: [],
      contacts: []
    }
  ];

  const mockCategories: Category[] = [
    { id: 1, name: 'Work', color: '#FF0000' }
  ];

  const mockContacts: Contact[] = [
    { id: 1, name: 'John Doe', initials: 'JD', email: 'john@example.com', phone: '123-456-7890', color: '#FF0000' }
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks', 'deleteTask']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    const addContactServiceSpy = jasmine.createSpyObj('AddContactService', ['getContacts']);
    const subtaskServiceSpy = jasmine.createSpyObj('SubtaskService', ['updateSubtask']);

    await TestBed.configureTestingModule({
      declarations: [BoardTaskOverlayComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AddContactService, useValue: addContactServiceSpy },
        { provide: SubtaskService, useValue: subtaskServiceSpy }
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    addContactService = TestBed.inject(AddContactService) as jasmine.SpyObj<AddContactService>;
    subtaskService = TestBed.inject(SubtaskService) as jasmine.SpyObj<SubtaskService>;

    fixture = TestBed.createComponent(BoardTaskOverlayComponent);
    component = fixture.componentInstance;

    taskService.getTasks.and.returnValue(of(mockTasks));
    categoryService.getCategories.and.returnValue(of(mockCategories));
    addContactService.getContacts.and.returnValue(of(mockContacts));
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(component.todoTasks.length).toBe(1);
    expect(component.todoTasks[0].title).toBe('Task 1');
  });

  it('should load categories on init', () => {
    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Work');
  });

  it('should load contacts on init', () => {
    expect(component.contacts.length).toBe(1);
    expect(component.contacts[0].name).toBe('John Doe');
  });

  it('should emit closeTaskOverlay event when onCloseTaskOverlay is called', () => {
    spyOn(component.closeTaskOverlay, 'emit');

    component.onCloseTaskOverlay();
    expect(component.closeTaskOverlay.emit).toHaveBeenCalled();
  });

  it('should emit taskDeleted and closeTaskOverlay events when deleteTask is called', () => {
    spyOn(component.taskDeleted, 'emit');
    spyOn(component.closeTaskOverlay, 'emit');
    component.selectedTask = mockTasks[0];
    taskService.deleteTask.and.returnValue(of({}));

    component.deleteTask();
    expect(taskService.deleteTask).toHaveBeenCalledWith(1); // Task ID is 1
    expect(component.taskDeleted.emit).toHaveBeenCalled();
    expect(component.closeTaskOverlay.emit).toHaveBeenCalled();
  });

  it('should update subtask completion when toggleSubtaskCompletion is called', () => {
    const subtask = mockTasks[0].subtasks[0];
    subtaskService.updateSubtask.and.returnValue(of({ ...subtask, completed: true }));

    component.toggleSubtaskCompletion(subtask);
    expect(subtask.completed).toBeTrue();
    expect(subtaskService.updateSubtask).toHaveBeenCalledWith(subtask.id!, subtask);
  });

  it('should emit taskUpdatedAndClosed event when handleTaskUpdatedAndClosed is called', () => {
    spyOn(component.taskUpdatedAndClosed, 'emit');
    spyOn(component.closeTaskOverlay, 'emit');

    component.handleTaskUpdatedAndClosed();
    expect(component.taskUpdatedAndClosed.emit).toHaveBeenCalled();
    expect(component.closeTaskOverlay.emit).toHaveBeenCalled();
    expect(component.isOverlayVisibleTask).toBeFalse();
    expect(component.selectedTask).toBeNull();
  });



  it('should return correct subtask completion string', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      subtasks: [{ text: 'Subtask 1', completed: true }, { text: 'Subtask 2', completed: false }]
    } as Task;

    const result = component.getSubtaskCompletion(task);
    expect(result).toBe('1/2');
  });


  
  it('should return the correct contact by ID', () => {
    component.contacts = [
      { id: 1, name: 'John Doe', email: 'john@example.com' } as Contact,
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' } as Contact
    ];

    const contact = component.getContactById(1);
    expect(contact).toEqual(jasmine.objectContaining({ id: 1, name: 'John Doe' }));
  });


  it('should return undefined if contact not found', () => {
    component.contacts = [
      { id: 1, name: 'John Doe', email: 'john@example.com' } as Contact,
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' } as Contact
    ];

    const contact = component.getContactById(3);
    expect(contact).toBeUndefined();
  });


  it('should return correct initials for a name', () => {
    const result = component.getInitials('John Doe');
    expect(result).toBe('JD');
  });

  it('should return single initial for single name', () => {
    const result = component.getInitials('John');
    expect(result).toBe('J');
  });


  it('should return correct subtask completion string', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      subtasks: [{ text: 'Subtask 1', completed: true }, { text: 'Subtask 2', completed: false }]
    } as Task;

    const result = component.getSubtaskCompletion(task);
    expect(result).toBe('1/2');
  });


  it('should return empty string if no subtasks', () => {
    const task = {
      id: 1,
      title: 'Test Task',
      subtasks: []
    } as Partial<Task>;
  
    const result = component.getSubtaskCompletion(task as Task);
    expect(result).toBe('');
  });


  it('should return 0% completion for tasks with no subtasks', () => {
    const task = {
      id: 1,
      title: 'Test Task',
      subtasks: []
    } as Partial<Task>;

    const result = component.getSubtaskCompletionPercentage(task as Task);
    expect(result).toBe(0);
  });


  it('should return correct completion percentage', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      subtasks: [{ text: 'Subtask 1', completed: true }, { text: 'Subtask 2', completed: false }]
    } as Task;

    const result = component.getSubtaskCompletionPercentage(task);
    expect(result).toBe(50);
  });


  it('should open the edit task overlay and hide the task overlay container', () => {
    component.isEditTaskVisible = false;
    component.isTaskOverlayContainerVisible = true;

    component.openEditTaskOverlay();

    expect(component.isEditTaskVisible).toBeTrue(); // The edit task overlay should be visible
    expect(component.isTaskOverlayContainerVisible).toBeFalse(); // The task overlay container should be hidden
  });


  it('should handle task update and hide the edit task overlay', () => {
    spyOn(component, 'loadTasks'); // Spy on the loadTasks method to ensure it's called

    component.isEditTaskVisible = true; // Simulate the overlay being open

    component.onTaskUpdated();

    expect(component.loadTasks).toHaveBeenCalled(); // Ensure the tasks are reloaded
    expect(component.isEditTaskVisible).toBeFalse(); // The edit task overlay should be hidden after update
  });


  it('should close the edit task overlay and reset selected task', () => {
    component.isEditTaskVisible = true;
    
    // Provide all required properties for the Task object
    component.selectedTask = {
      id: 1,
      title: 'Sample Task',
      priority: 'high',
      assigned_to: [],
      subtasks: [],
      contacts: [],
      due_date: '2024-01-01',
      status: 'todo'
    };

    component.closeEditTaskOverlay();

    expect(component.isEditTaskVisible).toBeFalse(); // The edit task overlay should be hidden
    expect(component.selectedTask).toBeNull(); // The selected task should be reset to null
  });
});
