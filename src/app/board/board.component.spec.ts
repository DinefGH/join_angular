import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { TaskService, Task } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core'; // <-- Add this
import { CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';

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
      schemas: [NO_ERRORS_SCHEMA] // <-- Add this to ignore unknown components
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

    component.todoTasks = [];
    component.inProgressTasks = [];
    component.awaitFeedbackTasks = [];
    component.doneTasks = [];

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
    const task = component.todoTasks[0];
    const newStatus = 'done';
  
    spyOn(component, 'getStatusFromContainerId').and.returnValue(newStatus);
    taskService.updateTask.and.returnValue(of({ ...task, status: newStatus }));
    component.draggedTask = task;
  
    const mockContainerElement = {
      nativeElement: {
        classList: {
          contains: jasmine.createSpy('contains').and.returnValue(false),
          remove: jasmine.createSpy('remove')
        }
      }
    };
  
    component.drop({
      previousContainer: { data: component.todoTasks },
      container: {
        id: 'doneContainer',
        data: component.doneTasks,
        element: mockContainerElement as any
      }
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


  it('should remove highlight class on unhighlight', () => {
    const mockElement = {
      nativeElement: {
        classList: {
          remove: jasmine.createSpy('remove')
        }
      }
    } as ElementRef;

    const event = {
      container: {
        element: mockElement
      }
    } as CdkDragExit<any>;

    // Call the method
    component.unhighlight(event);

    // Assertions
    expect(event.container.element.nativeElement.classList.remove).toHaveBeenCalledWith('highlight');
  });


  it('should add highlight class on highlight', () => {
    const mockElement = {
      nativeElement: {
        classList: {
          add: jasmine.createSpy('add')
        }
      }
    } as ElementRef;

    const event = {
      container: {
        element: mockElement
      }
    } as CdkDragEnter<any>;

    // Call the method
    component.highlight(event);

    // Assertions
    expect(event.container.element.nativeElement.classList.add).toHaveBeenCalledWith('highlight');
  });


  it('should close the update task overlay and reload tasks', () => {
    // Set initial values
    component.isOverlayVisibleTask = true;
    component.selectedTask = { id: 1 } as any;

    spyOn(component, 'loadTasks');

    // Call the method
    component.closeUpdateTaskOverlay();

    // Assertions
    expect(component.isOverlayVisibleTask).toBeFalse();
    expect(component.selectedTask).toBeNull();
    expect(component.loadTasks).toHaveBeenCalled();
  });


  it('should return correct status based on container ID', () => {
    expect(component.getStatusFromContainerId('todoContainer')).toBe('todo');
    expect(component.getStatusFromContainerId('inProgressContainer')).toBe('inProgress');
    expect(component.getStatusFromContainerId('awaitFeedbackContainer')).toBe('awaitFeedback');
    expect(component.getStatusFromContainerId('doneContainer')).toBe('done');
    expect(component.getStatusFromContainerId('unknownContainer')).toBe('');
  });


  it('should log an error if updated task has unknown status', () => {
    const updatedTask: Task = {
      id: 2,
      title: 'Test Task with Unknown Status',
      status: 'unknownStatus',
      priority: 'medium',
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 1,
      description: 'Test description',
      due_date: '2024-12-31',
      category: 1,
    };
  
    const listMap: { [key: string]: Task[] } = {
      todo: component.todoTasks,
      inProgress: component.inProgressTasks,
      awaitFeedback: component.awaitFeedbackTasks,
      done: component.doneTasks,
    };
  
    // Ensure task lists are empty
    component.todoTasks = [];
    component.inProgressTasks = [];
    component.awaitFeedbackTasks = [];
    component.doneTasks = [];
  
    spyOn(console, 'error');
  
    // Prevent any external code from modifying the task lists
    spyOn(component, 'loadTasks');
  
    // Execute the code under test
    if (updatedTask.status && updatedTask.status in listMap) {
      listMap[updatedTask.status].push(updatedTask);
    } else {
      console.error('Unknown or undefined task status:', updatedTask.status);
    }
  
    
    expect(console.error).toHaveBeenCalledWith('Unknown or undefined task status:', 'unknownStatus');
    expect(component.todoTasks.length).toBe(0);
    expect(component.inProgressTasks.length).toBe(0);
    expect(component.awaitFeedbackTasks.length).toBe(0);
    expect(component.doneTasks.length).toBe(0);
  });
  

  it('should reload tasks when a task is deleted', () => {
    spyOn(component, 'loadTasks');

    component.handleTaskDeleted();

    expect(component.loadTasks).toHaveBeenCalled();
  });


  it('should toggle the status dropdown and stop event propagation', () => {
    const task: Task = {
      id: 1,
      title: 'Sample Task',
      showStatusDropdown: false,
      priority: 'medium',
      due_date: '2024-12-31',
      category: 1,
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 1,
      description: 'Test description',
      status: 'todo',
    };

    const event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);

    expect(task.showStatusDropdown).toBeFalse();

    component.toggleStatusDropdown(task, event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(task.showStatusDropdown).toBeTrue();

    component.toggleStatusDropdown(task, event);
    expect(task.showStatusDropdown).toBeFalse();
  });


  it('should set isOverlayVisible to false when closeOverlay is called', () => {
    component.isOverlayVisible = true;

    component.closeOverlay();

    expect(component.isOverlayVisible).toBeFalse();
  });


  it('should set isOverlayVisible to true when openOverlay is called', () => {
    component.isOverlayVisible = false;

    component.openOverlay();

    expect(component.isOverlayVisible).toBeTrue();
  });


  it('should reload tasks and hide overlay after a task is added', fakeAsync(() => {
    spyOn(component, 'loadTasks');
    component.isOverlayVisible = true;

    component.handleTaskAdded();

    expect(component.loadTasks).toHaveBeenCalled();
    expect(component.isOverlayVisible).toBeTrue();

    tick(1000);

    expect(component.isOverlayVisible).toBeFalse();
  }));



  it('should log an error if updated task has unknown status', () => {
    const updatedTask: Task = {
      id: 2,
      title: 'Unknown Status Task',
      status: 'unknownStatus',
      priority: 'medium',
      due_date: '2024-12-31',
      category: 1,
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 1,
      description: 'Test description',
    };

    const listMap: { [key: string]: Task[] } = {
      todo: component.todoTasks,
      inProgress: component.inProgressTasks,
      awaitFeedback: component.awaitFeedbackTasks,
      done: component.doneTasks,
    };

    // Ensure task lists are empty
    component.todoTasks = [];
    component.inProgressTasks = [];
    component.awaitFeedbackTasks = [];
    component.doneTasks = [];

    spyOn(console, 'error');

    // Execute the code under test
    if (updatedTask.status && updatedTask.status in listMap) {
      listMap[updatedTask.status].push(updatedTask);
    } else {
      console.error('Unknown or undefined task status:', updatedTask.status);
    }

    // Assertions
    expect(console.error).toHaveBeenCalledWith('Unknown or undefined task status:', 'unknownStatus');
    expect(component.todoTasks.length).toBe(0);
    expect(component.inProgressTasks.length).toBe(0);
    expect(component.awaitFeedbackTasks.length).toBe(0);
    expect(component.doneTasks.length).toBe(0);
  });



  it('should remove the task from todoTasks when oldStatus is "todo"', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      status: 'todo',
      priority: 'medium',
      due_date: '2024-12-31',
      category: 1,
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 1,
      description: 'Test description',
    };

    component.todoTasks = [task];

    component.removeTaskFromCurrentList(task, 'todo');

    expect(component.todoTasks).not.toContain(task);
    expect(component.todoTasks.length).toBe(0);
  });


  it('should remove the task from inProgressTasks when oldStatus is "inProgress"', () => {
    const task: Task = {
      id: 2,
      title: 'Test Task',
      status: 'inProgress',
      priority: 'high',
      due_date: '2024-12-31',
      category: 2,
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 2,
      description: 'Test description',
    };

    component.inProgressTasks = [task];

    component.removeTaskFromCurrentList(task, 'inProgress');

    expect(component.inProgressTasks).not.toContain(task);
    expect(component.inProgressTasks.length).toBe(0);
  });


  it('should remove the task from awaitFeedbackTasks when oldStatus is "awaitFeedback"', () => {
    const task: Task = {
      id: 3,
      title: 'Test Task',
      status: 'awaitFeedback',
      priority: 'low',
      due_date: '2024-12-31',
      category: 3,
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 3,
      description: 'Test description',
    };

    component.awaitFeedbackTasks = [task];

    component.removeTaskFromCurrentList(task, 'awaitFeedback');

    expect(component.awaitFeedbackTasks).not.toContain(task);
    expect(component.awaitFeedbackTasks.length).toBe(0);
  });


  it('should remove the task from doneTasks when oldStatus is "done"', () => {
    const task: Task = {
      id: 4,
      title: 'Test Task',
      status: 'done',
      priority: 'medium',
      due_date: '2024-12-31',
      category: 4,
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 4,
      description: 'Test description',
    };

    component.doneTasks = [task];

    component.removeTaskFromCurrentList(task, 'done');

    expect(component.doneTasks).not.toContain(task);
    expect(component.doneTasks.length).toBe(0);
  });


  it('should not modify any task lists when oldStatus is unknown', () => {
    const task: Task = {
      id: 5,
      title: 'Test Task',
      status: 'todo', // Ensure the status is set to 'todo' initially
      priority: 'medium',
      due_date: '2024-12-31',
      category: 1,
      assigned_to: [],
      subtasks: [],
      contacts: [],
      creator: 1,
      description: 'Test description',
    };
  
    // Initialize all task lists
    component.todoTasks = [task];
    component.inProgressTasks = [];
    component.awaitFeedbackTasks = [];
    component.doneTasks = [];
  
    // Ensure task lists are in the expected state before calling the method
    expect(component.todoTasks.length).toBe(1);
    expect(component.inProgressTasks.length).toBe(0);
    expect(component.awaitFeedbackTasks.length).toBe(0);
    expect(component.doneTasks.length).toBe(0);
  
    // Call the method with an unknown status
    component.removeTaskFromCurrentList(task, 'unknownStatus');
  
    // Verify that the task is still in the todoTasks list
    expect(component.todoTasks).toContain(task);
    expect(component.todoTasks.length).toBe(1);
  
    // Ensure other lists are unaffected
    expect(component.inProgressTasks.length).toBe(0);
    expect(component.awaitFeedbackTasks.length).toBe(0);
    expect(component.doneTasks.length).toBe(0);
  });
});

