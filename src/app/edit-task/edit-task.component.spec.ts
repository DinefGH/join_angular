import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTaskComponent } from './edit-task.component';
import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { SubtaskService } from 'src/app/services/subtask.service';
import { NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { Task } from 'src/app/services/task.service';
import { Category } from 'src/app/services/category.service';
import { Contact } from 'src/assets/models/contact.model';
import { FormBuilder } from '@angular/forms'; // Make sure these are imported
import { fakeAsync, tick } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { flushMicrotasks } from '@angular/core/testing';
import { defer } from 'rxjs';

// Mock NgbDateParserFormatter with format and parse methods
class MockNgbDateParserFormatter extends NgbDateParserFormatter {
  parse(value: string) {
    return { year: 2025, month: 1, day: 1 }; // Mock parse logic
  }

  format(date: { year: number; month: number; day: number }) {
    return `${date.year}-${date.month}-${date.day}`; // Mock format logic
  }
}

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
    due_date: '2025-01-01',
    assigned_to: [1],
    subtasks: [{ id: 1, text: 'Subtask 1', completed: false }],
    status: 'todo',
    contacts: [1],
    creator: 1,
  };

  const mockCategories: Category[] = [
    { id: 1, name: 'Work', color: '#FF0000' },
    { id: 2, name: 'Personal', color: '#00FF00' },
  ];

  const mockContacts: Contact[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      color: '#FF0000',
      initials: 'JD',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      color: '#00FF00',
      initials: 'JS',
    },
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTask', 'updateTask']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    const addContactServiceSpy = jasmine.createSpyObj('AddContactService', ['getContacts']);
    const subtaskServiceSpy = jasmine.createSpyObj('SubtaskService', ['updateSubtask']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EditTaskComponent],
      imports: [ReactiveFormsModule, FormsModule, NgbDatepickerModule], // Ensure NgbDatepickerModule is included
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AddContactService, useValue: addContactServiceSpy },
        { provide: SubtaskService, useValue: subtaskServiceSpy },
        { provide: NgbDateParserFormatter, useClass: MockNgbDateParserFormatter }, // Use the proper mock
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore child components and templates if needed
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

  // function asyncData<T>(data: T) {
  //   return defer(() => Promise.resolve(data));
  // }

  // it('should handle form submission and task update', fakeAsync(() => {
  //   // Set taskId before ngOnInit is called
  //   component.taskId = 1;

  //   // Mock task fetching service to return mockTask asynchronously
  //   taskService.getTask.and.returnValue(asyncData(mockTask));

  //   // Initialize component (calls ngOnInit)
  //   fixture.detectChanges();

  //   // Simulate the passage of time to allow the subscription to complete
  //   flushMicrotasks();
  //   tick();
  //   fixture.detectChanges();

  //   // Now proceed to set the form values
  //   const fb = new FormBuilder();

  //   // Ensure the task form is correctly initialized with values, including 'status'
  //   component.taskForm.patchValue({
  //     title: 'Updated Task Title',
  //     description: 'Updated Task Description',
  //     priority: 'medium',
  //     due_date: { year: 2024, month: 1, day: 15 },
  //     category: 1,
  //     assigned_to: [1],
  //     contacts: [1],
  //     status: 'todo'
  //   });

  //   // Initialize 'subtasks' as FormArray
  //   const subtasksFormArray = component.taskForm.get('subtasks') as FormArray;

  //   // Assert that subtasksFormArray is not null
  //   expect(subtasksFormArray).not.toBeNull();

  //   subtasksFormArray.push(fb.group({
  //     id: [1],
  //     text: ['Subtask 1'],
  //     completed: [false]
  //   }));

  //   // Mock task update response
  //   taskService.updateTask.and.returnValue(asyncData(mockTask));

  //   // Simulate form submission
  //   component.updateTask();

  //   // Simulate passage of time for any asynchronous operations in updateTask()
  //   flushMicrotasks();
  //   tick();
  //   fixture.detectChanges();

  //   // Expectations
  //   expect(taskService.updateTask).toHaveBeenCalledWith(1, jasmine.any(Object));
  //   expect(component.addTaskSuccess).toBeTrue();
  //   expect(router.navigate).toHaveBeenCalledWith(['/board']);
  // }));

  it('should log form errors if form is invalid', () => {
    spyOn(component, 'logFormErrors');

    component.taskForm.get('title')?.setValue('');
    component.updateTask();

    expect(component.logFormErrors).toHaveBeenCalled();
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('should handle date selection and update form', () => {
    const date = { year: 2025, month: 12, day: 1 };
    component.onDateSelect(date);

    expect(component.taskForm.get('due_date')?.value).toBe('2025-12-01');
  });

  it('should handle date selection and update form', () => {
    const date = { year: 2025, month: 12, day: 1 };
    component.onDateSelect(date);

    expect(component.taskForm.get('due_date')?.value).toBe('2025-12-01');
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

  it('should toggle the dropdown', () => {
    component.isOpen = false;

    component.toggleDropdown();

    expect(component.isOpen).toBeTrue();

    component.toggleDropdown();

    expect(component.isOpen).toBeFalse();
  });

  it('should toggle the contacts dropdown', () => {
    component.isOpenContacts = false;

    component.toggleDropdownContacts();

    expect(component.isOpenContacts).toBeTrue();

    component.toggleDropdownContacts();

    expect(component.isOpenContacts).toBeFalse();
  });

  it('should select a category and close dropdown', () => {
    const category: Category = { id: 1, name: 'Work', color: '#FF0000' };
    const event = new MouseEvent('click');

    component.selectOption(category, event);

    expect(component.selectedOption).toBe(category);
    expect(component.taskForm.get('category')?.value).toBe(category.id);
    expect(component.isOpen).toBeFalse();
  });

  it('should select a contact and close the contacts dropdown', () => {
    const contact: Contact = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      color: '#FF0000',
      initials: 'JD',
    };
    const event = new MouseEvent('click');

    component.selectContact(contact, event);

    expect(component.selectedContact).toBe(contact);
    expect(component.isOpenContacts).toBeFalse();
  });

  it('should delete a subtask', () => {
    component.subtasks = [{ id: 1, text: 'Subtask 1', completed: false }];

    component.deleteSubtask(0);

    expect(component.subtasks.length).toBe(0);
  });

  it('should toggle icons visibility based on input focus', fakeAsync(() => {
    // First, check when focused is true
    component.toggleIcons(true);
    expect(component.isInputFocused).toBeTrue();

    // Then, check when focused is false
    component.toggleIcons(false);
    tick(100); // Simulate the 100ms delay from setTimeout
    expect(component.isInputFocused).toBeFalse();
  }));

  it('should log form errors and not call updateTask when form is invalid', () => {
    spyOn(component, 'logFormErrors');

    // Set form to invalid state
    component.taskForm.get('title')?.setValue(''); // Title is required, so this will make the form invalid

    // Call updateTask
    component.updateTask();

    // Check that form errors were logged and taskService.updateTask was not called
    expect(component.logFormErrors).toHaveBeenCalled();
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('should call updateTask when form is valid and handle successful update', fakeAsync(() => {
    const mockUpdatedTask = { ...mockTask, title: 'Updated Task' }; // Mock a successful task update response

    // Spy on event emitters and form reset method
    spyOn(component.taskUpdated, 'emit');
    spyOn(component.closeUpdateTaskOverlay, 'emit');
    spyOn(component.taskUpdatedAndClosed, 'emit');
    spyOn(component.taskForm, 'reset'); // Spy on the form's reset method

    // Do not spy on router.navigate here

    // Ensure taskId is set
    component.taskId = 1;

    // Set form to valid state
    component.taskForm.get('title')?.setValue('Updated Task Title');
    component.taskForm.get('priority')?.setValue('medium');
    component.taskForm.get('category')?.setValue(1);
    component.taskForm.get('due_date')?.setValue({ year: 2025, month: 1, day: 1 });

    // Mock successful update response
    taskService.updateTask.and.returnValue(of(mockUpdatedTask));

    // Call updateTask
    component.updateTask();

    // Simulate the passage of time for the setTimeout (3 seconds)
    tick(3000);

    // Verify the taskService.updateTask was called with correct data
    expect(taskService.updateTask).toHaveBeenCalledWith(1, jasmine.any(Object));

    // Ensure the form reset method was called
    expect(component.taskForm.reset).toHaveBeenCalled();

    // Ensure subtasks are cleared after the update
    expect(component.subtasks.length).toBe(0);

    // Verify success flag is set
    expect(component.addTaskSuccess).toBeTrue();

    // Ensure event emitters were triggered
    expect(component.taskUpdated.emit).toHaveBeenCalled();
    expect(component.closeUpdateTaskOverlay.emit).toHaveBeenCalled();
    expect(component.taskUpdatedAndClosed.emit).toHaveBeenCalled();

    // Verify the router navigated to '/board'
    expect(router.navigate).toHaveBeenCalledWith(['/board']);
  }));

  it('should log form errors', () => {
    // Make the form invalid by setting an empty value
    component.taskForm.get('title')?.setValue('');

    // Trigger validation
    component.taskForm.get('title')?.markAsTouched();
    component.taskForm.get('title')?.updateValueAndValidity();

    // Spy on console.error
    spyOn(console, 'error');

    // Call the logFormErrors method (no need to capture return value)
    component.logFormErrors();

    // Verify that console.error was called with the expected output
    expect(console.error).toHaveBeenCalledWith(
      'Form Errors:',
      jasmine.objectContaining({
        title: jasmine.any(Object), // Ensure title field error is logged
      }),
    );
  });

  it('should prepare the form data correctly for submission', () => {
    // Set form to valid state with a specific date
    component.taskForm.get('title')?.setValue('Test Task');
    component.taskForm.get('priority')?.setValue('medium');
    component.taskForm.get('category')?.setValue(1);
    component.taskForm.get('due_date')?.setValue({ year: 2025, month: 1, day: 1 }); // Ensure the date is '2025-01-01'

    // Call the method to prepare the submission data
    const preparedData = component.prepareSubmitData();

    // Check if the form data is correctly prepared
    expect(preparedData.due_date).toBe('2025-01-01'); // Expect the correct formatted date
  });

  it('should add a new subtask if input is valid', () => {
    const event = new MouseEvent('click');
    component.newSubtask = 'New Subtask';

    spyOn(component, 'clearInput');
    component.addSubtask(event, component.newSubtask);

    expect(component.subtasks.length).toBe(1); // Ensure subtask was added
    expect(component.subtasks[0].text).toBe('New Subtask'); // Ensure the text is correct
    expect(component.clearInput).toHaveBeenCalled(); // Ensure input was cleared
  });

  it('should not add a new subtask if input is empty', () => {
    const event = new MouseEvent('click');
    component.newSubtask = '   '; // Empty string

    component.addSubtask(event, component.newSubtask);

    expect(component.subtasks.length).toBe(0); // Ensure no subtask was added
  });

  it('should clear the input field after adding a subtask', () => {
    // Set up the subtaskInput element with a mocked value
    component.subtaskInput = {
      nativeElement: {
        value: 'New Subtask',
        focus: () => {}, // mock focus method if used in the component
      },
    } as ElementRef<HTMLInputElement>;

    // Call the method to clear the input field
    component.clearInput();

    // Assert that the input field is cleared
    expect(component.subtaskInput.nativeElement.value).toBe(''); // Ensure input was cleared
  });

  it('should delete a subtask', () => {
    component.subtasks = [{ text: 'Subtask 1', completed: false }];

    component.deleteSubtask(0);

    expect(component.subtasks.length).toBe(0); // Ensure the subtask was deleted
  });

  it('should not edit subtask if prompt returns null', () => {
    component.subtasks = [{ id: 1, text: 'Old Subtask', completed: false }];
    spyOn(window, 'prompt').and.returnValue(null); // Simulate canceling prompt

    component.editSubtask(0, 'Old Subtask');

    expect(component.subtasks[0].text).toBe('Old Subtask'); // Ensure no changes occurred
  });

  it('should handle subtask not found scenario during edit', () => {
    spyOn(window, 'prompt').and.returnValue('Updated Subtask');
    spyOn(console, 'error');

    component.editSubtask(0, 'Non-existent Subtask');

    expect(console.error).toHaveBeenCalledWith('Subtask not found, cannot update.');
  });
});
