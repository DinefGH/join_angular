import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService, Task } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { SubtaskService } from 'src/app/services/subtask.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Contact } from 'src/assets/models/contact.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { throwError } from 'rxjs';
import { ElementRef } from '@angular/core';



describe('AddTaskComponent - ngOnInit', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  // Mock services
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockAddContactService: jasmine.SpyObj<AddContactService>;
  let mockSubtaskService: jasmine.SpyObj<SubtaskService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNgbDateParserFormatter: jasmine.SpyObj<NgbDateParserFormatter>;

  beforeEach(async () => {
    // Create spies for the services
    const subtaskServiceSpy = jasmine.createSpyObj('SubtaskService', ['updateSubtask']);

    mockSubtaskService = jasmine.createSpyObj('SubtaskService', ['updateSubTask']);

    mockTaskService = jasmine.createSpyObj('TaskService', ['addTask', 'updateTask']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategories']);
    mockAddContactService = jasmine.createSpyObj('AddContactService', ['getContacts']); // Mock getContacts
    mockSubtaskService = jasmine.createSpyObj('SubtaskService', ['addSubtask']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNgbDateParserFormatter = jasmine.createSpyObj('NgbDateParserFormatter', ['parse', 'format']);

    // Mock data
    const categories: Category[] = [
      { id: 1, name: 'Work', color: '#FF0000' },
      { id: 2, name: 'Personal', color: '#00FF00' },
    ];

    const contacts: Contact[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', color: '#FF0000', initials: 'JD' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321', color: '#00FF00', initials: 'JD' }
    ];

    // Set up spies
    mockCategoryService.getCategories.and.returnValue(of(categories));
    mockAddContactService.getContacts.and.returnValue(of(contacts)); // Return mock contacts

    await TestBed.configureTestingModule({
      declarations: [AddTaskComponent],
      imports: [ReactiveFormsModule, NgbModule],
      providers: [
        FormBuilder,
        { provide: TaskService, useValue: mockTaskService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: AddContactService, useValue: mockAddContactService },
        { provide: SubtaskService, useValue: mockSubtaskService },
        { provide: Router, useValue: mockRouter },
        { provide: NgbDateParserFormatter, useValue: mockNgbDateParserFormatter },
        { provide: SubtaskService, useValue: subtaskServiceSpy }

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignore unknown custom components
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    mockSubtaskService = jasmine.createSpyObj('SubtaskService', ['updateSubTask']);


    // Spy on loadContacts method
    spyOn(component, 'loadContacts').and.callThrough();

    // Initialize the component (this will call ngOnInit)
    fixture.detectChanges();
  });

  it('should call loadContacts()', () => {
    expect(component.loadContacts).toHaveBeenCalled();
  });

  it('should load categories from the service', () => {
    expect(mockCategoryService.getCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Work');
    expect(component.categories[1].name).toBe('Personal');
  });

  it('should load contacts from the service', () => {
    expect(mockAddContactService.getContacts).toHaveBeenCalled();
    expect(component.contacts.length).toBe(2);
    expect(component.contacts[0].name).toBe('John Doe');
    expect(component.contacts[1].name).toBe('Jane Doe');
  });

  

  it('should correctly format the due date and prepare the submit data', () => {
    // Set form values
    component.taskForm.patchValue({
      title: 'Test Task',
      due_date: { year: 2024, month: 12, day: 31 },
      assigned_to: [],
    });

    // Set selected contacts and subtasks
    component.selectedContacts = [1, 2];
    component.subtasks = [
      { id: 1, text: 'Subtask 1', completed: false },
      { id: 2, text: 'Subtask 2', completed: true }
    ];

    // Call the prepareSubmitData method
    const preparedData = component.prepareSubmitData();

    // Expect the due_date to be formatted correctly
    expect(preparedData.due_date).toBe('2024-12-31');

    // Expect the assigned_to array to be set correctly
    expect(preparedData.assigned_to).toEqual([1, 2]);

    // Expect the subtasks to be correctly prepared
    expect(preparedData.subtasks).toEqual([
      { id: 1, text: 'Subtask 1', completed: false },
      { id: 2, text: 'Subtask 2', completed: true }
    ]);
  });



  it('should not modify due_date if not provided', () => {
    // Set form values without due_date
    component.taskForm.patchValue({
      title: 'Test Task',
      assigned_to: []
    });
  
    component.selectedContacts = [1, 2];
    component.subtasks = [
      { id: 1, text: 'Subtask 1', completed: false }
    ];
  
    const preparedData = component.prepareSubmitData();
  
    // Expect the due_date to be null (as the form will return null if not provided)
    expect(preparedData.due_date).toBeNull();
  
    // Expect assigned_to and subtasks to be correctly prepared
    expect(preparedData.assigned_to).toEqual([1, 2]);
    expect(preparedData.subtasks).toEqual([
      { id: 1, text: 'Subtask 1', completed: false }
    ]);
  });
  

  it('should correctly close the require dialog', () => {
    // Set hideRequireDialog to true
    component.hideRequireDialog = true;

    // Call closeRequireDialog
    component.closeRequireDialog();

    // Check that hideRequireDialog is set to false
    expect(component.hideRequireDialog).toBeFalse();
  });


  it('should log form errors and show the required dialog', () => {
    spyOn(console, 'log');
    component.taskForm.setErrors({ required: true });
  
    component.logFormErrors();
  
    expect(console.log).toHaveBeenCalledWith('Form Errors:', { required: true });
    expect(component.hideRequireDialog).toBeTrue();
  });





  it('should call updateTask on the service', () => {
    // Create a valid Task object with all necessary properties
    const mockUpdatedTask: Task = {
      id: 1,
      title: 'Updated Task',
      description: 'An updated task',
      priority: 'medium',
      due_date: '2024-12-31',
      category: 1,
      assigned_to: [1],
      subtasks: [],
      status: 'todo',
      contacts: [],
      creator: 1,
    };
  
    // Spy on the taskService's updateTask method
    const updateTaskSpy = mockTaskService.updateTask.and.returnValue(of(mockUpdatedTask));
  
    const taskId = 1;
  
    // Set valid form values for the task
    component.taskForm.setValue({
      title: 'Updated Task',
      description: 'An updated task',
      category: 1,
      priority: 'medium',
      due_date: null,
      assigned_to: [],
      status: 'todo'
    });
  
    // Call updateTask
    component.updateTask(taskId);
  
    // Expect updateTask to have been called with the taskId and form value
    expect(updateTaskSpy).toHaveBeenCalledWith(taskId, component.taskForm.value);
  });
  
  it('should log error if updateTask fails', () => {
    // Spy on the taskService's updateTask method to simulate an error
    const updateTaskSpy = mockTaskService.updateTask.and.returnValue(throwError(() => new Error('Failed to update task')));
    
    // Spy on console.error to verify error logging
    spyOn(console, 'error');
    
    const taskId = 1;
  
    // Call updateTask
    component.updateTask(taskId);
  
    // Expect updateTask to have been called and the error to be logged
    expect(updateTaskSpy).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Failed to update task:', jasmine.any(Error));
  });
  



  


  it('should call logFormErrors if form is invalid', () => {
    spyOn(component, 'logFormErrors');

    // Set form to invalid state
    component.taskForm.setErrors({ required: true });

    // Call createTask
    component.createTask();

    // Expect logFormErrors to be called
    expect(component.logFormErrors).toHaveBeenCalled();
    expect(mockTaskService.addTask).not.toHaveBeenCalled(); // Ensure addTask is not called when form is invalid
  });


  it('should call addTask on the service if form is valid', () => {
    const mockFormattedData = {
      id: 1,
      title: 'Formatted Test Task',
      description: 'Task description',
      priority: 'medium',
      due_date: '2024-12-31',
      category: 1,
      assigned_to: [1],
      subtasks: [],
      status: 'todo',
      contacts: [],
      creator: 1,
    }; // Complete mock task data
  
    const mockTaskResponse = { ...mockFormattedData }; // Simulating the returned task object
  
    // Spy on prepareSubmitData to return mock formatted data
    spyOn(component, 'prepareSubmitData').and.returnValue(mockFormattedData);
  
    // Spy on the taskAdded event emitter
    spyOn(component.taskAdded, 'emit');
  
    // Spy on taskForm's reset method
    spyOn(component.taskForm, 'reset');
  
    // Mock valid form state
    component.taskForm.setValue({
      title: 'Valid Task',
      description: 'Valid description',
      category: 1,
      priority: 'medium',
      due_date: null,
      assigned_to: [],
      status: 'todo'
    });
  
    // Simulate a successful addTask service call
    mockTaskService.addTask.and.returnValue(of(mockTaskResponse));
  
    // Call the createTask method
    component.createTask();
  
    // Ensure that addTask is called with the correctly formatted data
    expect(mockTaskService.addTask).toHaveBeenCalledWith(mockFormattedData);
  
    // Ensure that the taskAdded event was emitted
    expect(component.taskAdded.emit).toHaveBeenCalled();
  
    // Ensure that the form was reset
    expect(component.taskForm.reset).toHaveBeenCalled();
  
    // Ensure that the subtasks array was cleared
    expect(component.subtasks.length).toBe(0);
  });
  


it('should handle error when addTask fails', () => {
  const errorResponse = { error: { message: 'Task creation failed' } };
  
  // Spy on console.error and window.alert
  spyOn(console, 'error');
  spyOn(window, 'alert');
  
  mockTaskService.addTask.and.returnValue(throwError(() => errorResponse)); // Simulate failure

  // Mock valid form state
  component.taskForm.setValue({
    title: 'Valid Task',
    description: 'Valid description',
    category: 1,
    priority: 'medium',
    due_date: null,
    assigned_to: [],
    status: 'todo'
  });

  // Call createTask
  component.createTask();

  // Expect error handling logic
  expect(mockTaskService.addTask).toHaveBeenCalled();
  expect(console.error).toHaveBeenCalledWith('Failed to create task:', errorResponse);
  expect(window.alert).toHaveBeenCalledWith('Failed to create task: Task creation failed');
});



  it('should navigate to /board after task creation with a delay', fakeAsync(() => {
    const mockTaskData = { title: 'Test Task' } as Task;

    // Mock valid form state
    component.taskForm.setValue({
      title: 'Valid Task',
      description: 'Valid description',
      category: 1,
      priority: 'medium',
      due_date: null,
      assigned_to: [],
      status: 'todo'
    });

    mockTaskService.addTask.and.returnValue(of(mockTaskData)); // Simulate success

    // Call createTask
    component.createTask();
    
    // Use tick() to simulate the passage of time for the setTimeout
    tick(3000); // Simulate 3 seconds

    // Expect navigation to have occurred
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/board']);
  }));



  it('should delete a subtask by index', () => {
    // Add some mock subtasks to the array
    component.subtasks = [
      { id: 1, text: 'Subtask 1', completed: false },
      { id: 2, text: 'Subtask 2', completed: true }
    ];
  
    // Call deleteSubtask with index 0
    component.deleteSubtask(0);
  
    // Assert that the subtask at index 0 was deleted
    expect(component.subtasks.length).toBe(1);
    expect(component.subtasks[0].id).toBe(2);
  });


  it('should edit a subtask locally when no ID is present', () => {
    // Mock subtasks without an ID
    component.subtasks = [
      { text: 'Subtask 1', completed: false }
    ];
  
    // Spy on the prompt to simulate user input
    spyOn(window, 'prompt').and.returnValue('Updated Subtask');
  
    // Call editSubtask with index 0
    component.editSubtask(0, 'Subtask 1');
  
    // Assert that the subtask text was updated
    expect(component.subtasks[0].text).toBe('Updated Subtask');
  });



  it('should handle subtask not found scenario during edit', () => {
    spyOn(window, 'prompt').and.returnValue('Updated Subtask');
    spyOn(console, 'error');
  
    component.subtasks = []; // Simulate no subtask
  
    component.editSubtask(0, 'Non-existent Subtask');
  
    expect(console.error).toHaveBeenCalledWith('Subtask not found, cannot update.');
  });


  it('should not edit subtask if prompt is canceled', () => {
    // Mock a subtask
    component.subtasks = [
      { id: 1, text: 'Subtask 1', completed: false }
    ];
  
    // Spy on the prompt to simulate user canceling the prompt (returning null)
    spyOn(window, 'prompt').and.returnValue(null);
  
    // Call editSubtask with index 0
    component.editSubtask(0, 'Subtask 1');
  
    // Assert that the subtask text was not updated
    expect(component.subtasks[0].text).toBe('Subtask 1');
  });


  it('should handle subtask not found at index', () => {
    component.subtasks = []; // Empty subtasks

    spyOn(window, 'prompt').and.returnValue('Updated Subtask');
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.editSubtask(0, 'Subtask 1');

    expect(console.error).toHaveBeenCalledWith('Subtask not found, cannot update.');
    expect(window.alert).toHaveBeenCalledWith('Subtask cannot be updated as it was not found.');
  });


  it('should clear the subtask input field', () => {
    // Mock the subtaskInput element and its nativeElement with proper HTMLInputElement properties
    const inputElement = new ElementRef({ value: 'Some value' } as HTMLInputElement);
    
    // Assign the mock inputElement to component.subtaskInput
    component.subtaskInput = inputElement;
    
    // Call the clearInput method
    component.clearInput();
    
    // Assert that the input field value is now an empty string
    expect(component.subtaskInput.nativeElement.value).toBe('');
  });


  it('should add a new subtask and clear the input when subtask value is valid', () => {
    // Arrange: Create a mock event and mock the clearInput method
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'preventDefault');
    spyOn(component, 'clearInput');
    
    // Initial state
    component.subtasks = [];
    
    // Act: Call the addSubtask method with a valid subtask value
    component.addSubtask(mockEvent, '  New Subtask  ');
    
    // Assert: Check that preventDefault is called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Assert: Check that the new subtask is added (trimmed)
    expect(component.subtasks.length).toBe(1);
    expect(component.subtasks[0].text).toBe('New Subtask');
    expect(component.subtasks[0].completed).toBeFalse();
    
    // Assert: Check that clearInput is called
    expect(component.clearInput).toHaveBeenCalled();
  });

  it('should not add a subtask if subtask value is empty or just whitespace', () => {
    // Arrange: Create a mock event and spy on clearInput
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'preventDefault');
    spyOn(component, 'clearInput');
    
    // Act: Call addSubtask with an empty string
    component.addSubtask(mockEvent, '    '); // Only whitespace
    
    // Assert: Check that preventDefault is called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Assert: Ensure no subtask is added
    expect(component.subtasks.length).toBe(0);
    
    // Assert: Ensure clearInput is not called when no subtask is added
    expect(component.clearInput).not.toHaveBeenCalled();
  });



  it('should set isInputFocused to true immediately when focused is true', () => {
    // Arrange: Set the initial value of isInputFocused to false
    component.isInputFocused = false;
  
    // Act: Call toggleIcons with focused as true
    component.toggleIcons(true);
  
    // Assert: isInputFocused should be immediately set to true
    expect(component.isInputFocused).toBeTrue();
  });


  it('should set isInputFocused to false after a 100ms delay when focused is false', fakeAsync(() => {
    // Arrange: Set the initial value of isInputFocused to true
    component.isInputFocused = true;
  
    // Act: Call toggleIcons with focused as false
    component.toggleIcons(false);
  
    // Fast forward time by 100ms
    tick(100);
  
    // Assert: isInputFocused should be set to false after 100ms
    expect(component.isInputFocused).toBeFalse();
  }));



  it('should not set isInputFocused to false immediately when focused is false', fakeAsync(() => {
    // Arrange: Set the initial value of isInputFocused to true
    component.isInputFocused = true;
  
    // Act: Call toggleIcons with focused as false
    component.toggleIcons(false);
  
    // Assert: isInputFocused should still be true before the timeout
    expect(component.isInputFocused).toBeTrue();
  
    // Fast forward time by 100ms
    tick(100);
  
    // Assert: After 100ms, it should be set to false
    expect(component.isInputFocused).toBeFalse();
  }));


  it('should return the contact with the given ID', () => {
    // Arrange: Set up the mock contacts array with all required properties
    const mockContacts: Contact[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', initials: 'JD', color: '#FF0000' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321', initials: 'JD', color: '#00FF00' },
    ];
  
    component.contacts = mockContacts;
  
    // Act: Call getContactById with a valid contact ID
    const result = component.getContactById(1);
  
    // Assert: The returned contact should match the contact with ID 1
    expect(result).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', initials: 'JD', color: '#FF0000' });
  });

  it('should return undefined if no contact with the given ID exists', () => {
    // Arrange: Set up the mock contacts array with all required properties
    const mockContacts: Contact[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', initials: 'JD', color: '#FF0000' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321', initials: 'JD', color: '#00FF00' },
    ];
  
    component.contacts = mockContacts;
  
    // Act: Call getContactById with an invalid contact ID
    const result = component.getContactById(3);
  
    // Assert: The result should be undefined as no contact with ID 3 exists
    expect(result).toBeUndefined();
  });



  it('should add contactId to selectedContacts if not already present', () => {
    // Arrange: Set initial state
    const contactId = 1;
    component.selectedContacts = [];
  
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation'); // Spy on stopPropagation to ensure it's called
  
    // Act: Call handleContactClick
    component.handleContactClick(contactId, mockEvent);
  
    // Assert: contactId should be added to selectedContacts
    expect(component.selectedContacts).toContain(contactId);
    expect(mockEvent.stopPropagation).toHaveBeenCalled(); // Ensure stopPropagation is called
  });


  it('should remove contactId from selectedContacts if already present', () => {
    // Arrange: Set initial state with contactId already in selectedContacts
    const contactId = 1;
    component.selectedContacts = [1];
  
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation'); // Spy on stopPropagation to ensure it's called
  
    // Act: Call handleContactClick
    component.handleContactClick(contactId, mockEvent);
  
    // Assert: contactId should be removed from selectedContacts
    expect(component.selectedContacts).not.toContain(contactId);
    expect(mockEvent.stopPropagation).toHaveBeenCalled(); // Ensure stopPropagation is called
  });


  it('should add contactId to assigned_to when isChecked is true', () => {
    // Arrange
    const contactId = 1;
    const isChecked = true;

    // Act: Call toggleContactSelection
    component.toggleContactSelection(contactId, isChecked);

    // Assert: contactId should be added to the assigned_to array
    const assignedTo = component.taskForm.get('assigned_to')?.value;
    expect(assignedTo).toContain(contactId);
  });


  it('should not add contactId to assigned_to if it already exists and isChecked is true', () => {
    // Arrange
    const contactId = 1;
    const isChecked = true;
    component.taskForm.get('assigned_to')?.setValue([contactId]); // Pre-populate form with contactId

    // Act: Call toggleContactSelection
    component.toggleContactSelection(contactId, isChecked);

    // Assert: contactId should not be duplicated in the assigned_to array
    const assignedTo = component.taskForm.get('assigned_to')?.value;
    expect(assignedTo).toEqual([contactId]); // Should still only have one occurrence
  });



  it('should remove contactId from assigned_to when isChecked is false', () => {
    // Arrange
    const contactId = 1;
    const isChecked = false;
    component.taskForm.get('assigned_to')?.setValue([contactId]); // Pre-populate form with contactId

    // Act: Call toggleContactSelection
    component.toggleContactSelection(contactId, isChecked);

    // Assert: contactId should be removed from the assigned_to array
    const assignedTo = component.taskForm.get('assigned_to')?.value;
    expect(assignedTo).not.toContain(contactId);
  });


  it('should not remove contactId from assigned_to if it is not in the array and isChecked is false', () => {
    // Arrange
    const contactId = 1;
    const isChecked = false;
    component.taskForm.get('assigned_to')?.setValue([]); // Pre-populate with an empty array

    // Act: Call toggleContactSelection
    component.toggleContactSelection(contactId, isChecked);

    // Assert: Nothing should change since contactId was not in the array
    const assignedTo = component.taskForm.get('assigned_to')?.value;
    expect(assignedTo).toEqual([]); // Still an empty array
  });


  it('should return empty string if name is undefined', () => {
    // Act: Call getInitials with undefined
    const result = component.getInitials(undefined);

    // Assert: Should return empty string
    expect(result).toBe('');
  });


  it('should return empty string if name is an empty string', () => {
    // Act: Call getInitials with an empty string
    const result = component.getInitials('');

    // Assert: Should return empty string
    expect(result).toBe('');
  });


  it('should return initials for a single name', () => {
    // Act: Call getInitials with a single name
    const result = component.getInitials('John');

    // Assert: Should return first letter of the name
    expect(result).toBe('J');
  });


  it('should return initials for a full name', () => {
    // Act: Call getInitials with a full name
    const result = component.getInitials('John Doe');

    // Assert: Should return first letters of both names
    expect(result).toBe('JD');
  });



  it('should return initials for a name with multiple spaces', () => {
    // Act: Call getInitials with extra spaces in the name
    const result = component.getInitials('  John   Doe  ');

    // Assert: Should return initials and ignore extra spaces
    expect(result).toBe('JD');
  });



  it('should handle names with more than two words and return initials of the first two', () => {
    // Act: Call getInitials with more than two names
    const result = component.getInitials('John Michael Doe');

    // Assert: Should return initials for the first two words only
    expect(result).toBe('JM');
  });


  it('should handle names with lowercase letters and return uppercase initials', () => {
    // Act: Call getInitials with lowercase names
    const result = component.getInitials('john doe');

    // Assert: Should return uppercase initials
    expect(result).toBe('JD');
  });


  it('should handle names with only one letter', () => {
    // Act: Call getInitials with a single letter name
    const result = component.getInitials('A');

    // Assert: Should return the uppercase letter
    expect(result).toBe('A');
  });


  it('should return an empty string when name consists only of spaces', () => {
    // Act: Call getInitials with a name containing only spaces
    const result = component.getInitials('     ');

    // Assert: Should return empty string
    expect(result).toBe('');
  });


  it('should set selectedContact and close the contacts dropdown', () => {
    // Arrange: Create a mock contact and a mock event
    const mockContact: Contact = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      color: '#FF0000',
      initials: 'JD'
    };
    
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation'); // Spy on stopPropagation to verify it gets called

    // Act: Call the selectContact function
    component.selectContact(mockContact, mockEvent);

    // Assert: Check that selectedContact is set correctly
    expect(component.selectedContact).toEqual(mockContact);

    // Assert: Check that isOpenContacts is set to false
    expect(component.isOpenContacts).toBeFalse();

    // Assert: Ensure stopPropagation was called to prevent event bubbling
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });



  it('should set selectedOption, update form control, and close the dropdown', () => {
    // Arrange: Create a mock category and a mock event
    const mockCategory: Category = {
      id: 1,
      name: 'Work',
      color: '#FF0000'
    };
    
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation'); // Spy on stopPropagation to verify it gets called

    // Mock form control for 'category'
    const formControlSpy = spyOn(component.taskForm.get('category')!, 'setValue');

    // Act: Call the selectOption function
    component.selectOption(mockCategory, mockEvent);

    // Assert: Check that selectedOption is set correctly
    expect(component.selectedOption).toEqual(mockCategory);

    // Assert: Ensure the form control for 'category' is updated
    expect(formControlSpy).toHaveBeenCalledWith(mockCategory.id);

    // Assert: Check that the dropdown is closed
    expect(component.isOpen).toBeFalse();

    // Assert: Ensure stopPropagation was called to prevent event bubbling
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });


  it('should toggle the isOpen value in toggleDropdown()', () => {
    // Arrange: Set initial value for isOpen
    component.isOpen = false;

    // Act: Call the toggleDropdown function
    component.toggleDropdown();

    // Assert: Ensure that isOpen has been toggled to true
    expect(component.isOpen).toBeTrue();

    // Act: Call the toggleDropdown function again
    component.toggleDropdown();

    // Assert: Ensure that isOpen has been toggled back to false
    expect(component.isOpen).toBeFalse();
  });


  it('should toggle the isOpenContacts value in toggleDropdownContacts()', () => {
    // Arrange: Set initial value for isOpenContacts
    component.isOpenContacts = false;

    // Act: Call the toggleDropdownContacts function
    component.toggleDropdownContacts();

    // Assert: Ensure that isOpenContacts has been toggled to true
    expect(component.isOpenContacts).toBeTrue();

    // Act: Call the toggleDropdownContacts function again
    component.toggleDropdownContacts();

    // Assert: Ensure that isOpenContacts has been toggled back to false
    expect(component.isOpenContacts).toBeFalse();
  });



  
  it('should correctly format the date and set it in dpInput and taskForm', () => {
    // Define the NgbDateStruct date
    const date: NgbDateStruct = { year: 2024, month: 12, day: 25 };
  
    // Mock the dpInput.nativeElement.value
    component.dpInput = new ElementRef({
      value: ''
    } as HTMLInputElement); // Cast as HTMLInputElement to avoid TypeScript error
  
    // Mock taskForm's 'due_date' control
    component.taskForm = new FormBuilder().group({
      due_date: ['']
    });
  
    // Act: Call the onDateSelect function
    component.onDateSelect(date);
  
    // Assert: Ensure the date is correctly formatted and set in dpInput
    expect(component.dpInput.nativeElement.value).toBe('2024-12-25');
  
    // Assert: Ensure the date is correctly set in the form control
    expect(component.taskForm.get('due_date')?.value).toBe('2024-12-25');
  });
  

  it('should handle single digit months and days by padding them correctly', () => {
    // Define the date with single-digit month and day
    const singleDigitDate: NgbDateStruct = { year: 2024, month: 5, day: 7 };
  
    // Mock dpInput's nativeElement and value
    component.dpInput = new ElementRef({
      value: ''
    } as HTMLInputElement);
  
    // Initialize the task form
    component.taskForm = new FormBuilder().group({
      due_date: ['']
    });
  
    // Act: Call the onDateSelect function with single digit date
    component.onDateSelect(singleDigitDate);
  
    // Assert: Ensure the formatted date is padded with zeroes
    expect(component.dpInput.nativeElement.value).toBe('2024-05-07');
    expect(component.taskForm.get('due_date')?.value).toBe('2024-05-07');
  });
});

