import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTaskComponent } from './edit-task.component';
import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { SubtaskService } from 'src/app/services/subtask.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Task } from 'src/app/services/task.service';
import { Category } from 'src/app/services/category.service';
import { Contact } from 'src/assets/models/contact.model';

describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let addContactService: jasmine.SpyObj<AddContactService>;
  let subtaskService: jasmine.SpyObj<SubtaskService>;
  let router: jasmine.SpyObj<Router>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Task Description',
    priority: 'high',
    category: 1,
    due_date: '2024-01-01',
    assigned_to: [1],
    subtasks: [{ id: 1, text: 'Subtask 1', completed: false }],
    status: 'todo',
    contacts: [1],
    creator: 1
  };

  const mockCategories: Category[] = [
    { id: 1, name: 'Work', color: '#FF0000' },
    { id: 2, name: 'Personal', color: '#00FF00' }
  ];

  const mockContacts: Contact[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', color: '#FF0000', initials: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', color: '#00FF00', initials: 'JS' }
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTask', 'updateTask']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    const addContactServiceSpy = jasmine.createSpyObj('AddContactService', ['getContacts']);
    const subtaskServiceSpy = jasmine.createSpyObj('SubtaskService', ['updateSubtask']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EditTaskComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AddContactService, useValue: addContactServiceSpy },
        { provide: SubtaskService, useValue: subtaskServiceSpy },
        { provide: NgbDateParserFormatter, useValue: {} },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore child components and templates
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    addContactService = TestBed.inject(AddContactService) as jasmine.SpyObj<AddContactService>;
    subtaskService = TestBed.inject(SubtaskService) as jasmine.SpyObj<SubtaskService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;

    taskService.getTask.and.returnValue(of(mockTask));
    categoryService.getCategories.and.returnValue(of(mockCategories));
    addContactService.getContacts.and.returnValue(of(mockContacts));
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load task on init and populate form', () => {
    component.taskId = 1;
    component.ngOnInit();

    expect(taskService.getTask).toHaveBeenCalledWith(1);
    expect(component.taskForm.get('title')?.value).toBe('Test Task');
    expect(component.subtasks.length).toBe(1);
  });

  it('should load categories on init', () => {
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
  });

  it('should load contacts on init', () => {
    expect(addContactService.getContacts).toHaveBeenCalled();
    expect(component.contacts.length).toBe(2);
  });

  it('should handle form submission and task update', () => {
    component.taskId = 1;
    component.ngOnInit();
    taskService.updateTask.and.returnValue(of(mockTask));

    component.updateTask();

    expect(taskService.updateTask).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(component.addTaskSuccess).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/board']);
  });

  it('should log form errors if form is invalid', () => {
    spyOn(component, 'logFormErrors');

    component.taskForm.get('title')?.setValue('');
    component.updateTask();

    expect(component.logFormErrors).toHaveBeenCalled();
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('should handle date selection and update form', () => {
    const date = { year: 2024, month: 12, day: 1 };
    component.onDateSelect(date);

    expect(component.taskForm.get('due_date')?.value).toBe('2024-12-01');
  });

  it('should add a new subtask', () => {
    component.newSubtask = 'New Subtask';
    const event = new MouseEvent('click');
    
    component.addSubtask(event, component.newSubtask);

    expect(component.subtasks.length).toBe(2);
    expect(component.subtasks[1].text).toBe('New Subtask');
  });

  it('should edit an existing subtask', () => {
    spyOn(window, 'prompt').and.returnValue('Updated Subtask');
    const subtaskIndex = 0;
    subtaskService.updateSubtask.and.returnValue(of({ id: 1, text: 'Updated Subtask', completed: false }));

    component.editSubtask(subtaskIndex, 'Subtask 1');

    expect(subtaskService.updateSubtask).toHaveBeenCalledWith(1, { id: 1, text: 'Updated Subtask', completed: false });
    expect(component.subtasks[0].text).toBe('Updated Subtask');
  });

  it('should delete a subtask', () => {
    component.deleteSubtask(0);
    expect(component.subtasks.length).toBe(0);
  });

  it('should toggle contact selection', () => {
    const contactId = 1;
    component.toggleContactSelection(contactId, true);

    expect(component.taskForm.get('assigned_to')?.value).toContain(contactId);

    component.toggleContactSelection(contactId, false);

    expect(component.taskForm.get('assigned_to')?.value).not.toContain(contactId);
  });

  it('should close edit task overlay when onCloseEditTaskOverlay is called', () => {
    spyOn(component.closeEditTaskOverlay, 'emit');

    component.onCloseEditTaskOverlay();
    expect(component.closeEditTaskOverlay.emit).toHaveBeenCalled();
  });
});
