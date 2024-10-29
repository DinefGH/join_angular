/**
 * Component for adding a new task, handling form data and interactions with services.
 * Manages subtasks, contacts, and date selection.
 *
 * @component
 */
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { SubtaskService, Subtask } from 'src/app/services/subtask.service';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {

  /** Reference to the date picker input element for programmatic access. */
  @ViewChild('dpInput') dpInput!: ElementRef<HTMLInputElement>;


  /** Minimum date allowed for task due date selection */
  minDate!: NgbDateStruct;


    /** Form group for task creation */
  taskForm: FormGroup;

/** Reference to the subtask input element for adding new subtasks. */
  @ViewChild('subtaskInput') subtaskInput!: ElementRef<HTMLInputElement>;

    /** List of available categories for tasks */
  categories: Category[] = [];

/** Currently selected category for the task. */
  selectedOption?: Category;

/** Controls visibility of the category dropdown. */
  isOpen = false;

  /** Controls whether header and footer are displayed */
  @Input() hideHeaderFooter: boolean = false;

    /** Custom height for the task component */
  @Input() height: string = '100%';

    /** Custom width for the task component */
  @Input() width: string = '100%';

    /** Event emitted when a task is successfully added */
  @Output() taskAdded = new EventEmitter<void>();

  /** Boolean indicating if task was successfully added */
  addTaskSuccess = false;

  /** List of contacts available for assignment */
  contacts: Contact[] = [];

  /** Currently selected contact for the task */
  selectedContact: Contact | null = null;

/** Controls visibility of the contacts dropdown. */
  isOpenContacts = false;

/** Array of selected contact IDs for task assignment. */
  selectedContacts: number[] = [];

/** Maximum number of visible contacts in dropdown before truncation. */
  maxVisibleContacts: number = 3;

/** Tracks input focus state for contact dropdown icons. */
  isInputFocused: boolean = false;

/** Toggles the display of the required fields dialog. */
  hideRequireDialog = false;

    /** Subtasks associated with the task */
  subtasks: Subtask[] = [];

/** New subtask text input by the user. */
  newSubtask: string = '';

  /**
   * Constructs the AddTaskComponent and initializes necessary services for task handling.
   * Sets up the reactive form with validation rules for adding tasks.
   *
   * @constructor
   * @param ngbDateParserFormatter - Service for parsing and formatting date input.
   * @param addContactService - Service for handling contact-related operations.
   * @param fb - FormBuilder service for constructing reactive forms.
   * @param categoryService - Service to manage task categories.
   * @param taskService - Service to handle task operations, including add and update.
   * @param subtaskService - Service for managing subtasks related to tasks.
   * @param router - Router service for navigation within the application.
   */
  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private addContactService: AddContactService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private router: Router,
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: [null],
      priority: ['', Validators.required],
      due_date: [null],
      assigned_to: [[]],
      status: ['todo'],
    });
  }

  /**
   * Initializes the component by setting minimum date and loading categories and contacts.
   */
  ngOnInit(): void {
    const today = new Date();
    this.minDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.loadContacts();

    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
      error: error => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  /**
   * Handles date selection and updates the form's due date.
   * @param date Selected date from date picker
   */
  onDateSelect(date: NgbDateStruct): void {
    const formattedDate = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    this.dpInput.nativeElement.value = formattedDate;
    this.taskForm.get('due_date')?.setValue(formattedDate);
  }

  /**
   * Toggles the display of the category dropdown.
   */
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  /**
   * Toggles the display of the contacts dropdown.
   */
  toggleDropdownContacts(): void {
    this.isOpenContacts = !this.isOpenContacts;
  }

  /**
   * Selects a task category and updates the form with the selected category ID.
   * @param category - The selected category object.
   * @param event - The MouseEvent to prevent further event propagation.
   */
  selectOption(category: Category, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedOption = category;
    this.taskForm.get('category')?.setValue(category.id);
    this.isOpen = false;
  }

  /**
   * Selects a contact for the task and closes the contacts dropdown.
   * @param contact - The selected contact object.
   * @param event - The MouseEvent to stop further event propagation.
   */
  selectContact(contact: Contact, event: MouseEvent): void {
    this.selectedContact = contact;
    this.isOpenContacts = false;
    event.stopPropagation();
  }

  /**
   * Loads contacts from the AddContactService.
   * Logs an error if loading fails.
   */
  loadContacts(): void {
    this.addContactService.getContacts().subscribe({
      next: contacts => {
        this.contacts = contacts;
      },
      error: error => {
        console.error('Failed to load contacts:', error);
      },
    });
  }

  /**
   * Generates initials from a contact's name, using the first two words.
   * @param name - The name string to derive initials from.
   * @returns The initials as a string.
   */
  getInitials(name: string | undefined): string {
    if (!name) return '';

    let initials = name
      .split(' ')
      .filter(n => n !== '')
      .map(n => n[0]?.toUpperCase() ?? '')
      .slice(0, 2);

    return initials.join('');
  }

  /**
   * Toggles the selection of a contact for assignment to the task.
   * Updates the task form with the current selected contacts.
   * @param contactId - The ID of the contact being selected or deselected.
   * @param isChecked - Boolean indicating whether the contact is selected or not.
   */
  toggleContactSelection(contactId: number, isChecked: boolean): void {
    const currentContacts = this.taskForm.get('assigned_to')?.value || [];
    if (isChecked) {
      if (!currentContacts.includes(contactId)) {
        currentContacts.push(contactId);
      }
    } else {
      const index = currentContacts.indexOf(contactId);
      if (index > -1) {
        currentContacts.splice(index, 1);
      }
    }
    this.taskForm.get('assigned_to')?.setValue(currentContacts);
  }

  /**
   * Handles clicking on a contact by toggling its selection.
   * @param contactId - The ID of the contact clicked.
   * @param event - Mouse event to prevent further event propagation.
   */
  handleContactClick(contactId: number, event: MouseEvent): void {
    event.stopPropagation();

    const index = this.selectedContacts.indexOf(contactId);
    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(contactId);
    }
  }

  /**
   * Retrieves a contact by ID from the contacts list.
   * @param contactId - The ID of the contact to retrieve.
   * @returns The Contact object if found, undefined otherwise.
   */
  getContactById(contactId: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === contactId);
  }

  /**
   * Toggles the visibility of icons based on input focus state.
   * @param focused - Boolean indicating the focus state of the input.
   */
  toggleIcons(focused: boolean): void {
    if (!focused) {
      setTimeout(() => (this.isInputFocused = focused), 100);
    } else {
      this.isInputFocused = focused;
    }
  }

  /**
   * Adds a new subtask to the subtasks list after trimming input.
   * @param event - Mouse event to prevent default form submission.
   * @param subtaskValue - The value of the new subtask input.
   */
  addSubtask(event: MouseEvent, subtaskValue: string): void {
    event.preventDefault();
    const trimmedValue = subtaskValue.trim();
    if (trimmedValue) {
      const newSubtask = { text: trimmedValue, completed: false }; // Do not create in backend here
      this.subtasks.push(newSubtask);
      this.clearInput();
    }
  }

  /**
   * Clears the subtask input field.
   */
  clearInput(): void {
    this.subtaskInput.nativeElement.value = '';
  }

  /**
   * Deletes a subtask from the subtasks list at the specified index.
   * @param index - The index of the subtask to delete.
   */
  deleteSubtask(index: number): void {
    this.subtasks.splice(index, 1);
  }

  /**
   * Edits an existing subtask, updating its text based on user input.
   * @param index - The index of the subtask to edit.
   * @param subtaskText - The current text of the subtask.
   */
  editSubtask(index: number, subtaskText: string): void {
    const editedSubtaskText = prompt('Edit Subtask:', subtaskText);
    if (editedSubtaskText !== null && editedSubtaskText.trim() !== '') {
      const subtask = this.subtasks[index];
      if (subtask) {
        subtask.text = editedSubtaskText.trim();

        // Check if subtask has an ID, meaning it exists in the backend
        if (subtask.id !== undefined) {
          this.subtaskService.updateSubtask(subtask.id, subtask).subscribe({
            next: updatedSubtask => {},
            error: error => {
              console.error('Failed to update subtask:', error);
              alert('Failed to update subtask. Please try again.');
            },
          });
        } else {
          // If no ID, it is a new subtask and just update the local array
          this.subtasks[index] = subtask;
        }
      } else {
        console.error('Subtask not found, cannot update.');
        alert('Subtask cannot be updated as it was not found.');
      }
    }
  }

  /**
   * Creates a new task by submitting the form data, including subtasks.
   * Navigates to the task board upon success.
   */
  createTask(): void {
    if (!this.taskForm.valid) {
      this.logFormErrors();
      return;
    }

    const formattedData = this.prepareSubmitData();

    this.taskService.addTask(formattedData).subscribe({
      next: task => {
        this.taskAdded.emit();
        this.taskForm.reset();
        this.subtasks = [];
      },
      error: error => {
        console.error('Failed to create task:', error);
        alert('Failed to create task: ' + (error.error.message || error.message));
      },
    });

    this.addTaskSuccess = true;
    setTimeout(() => {
      this.router.navigate(['/board']);
    }, 3000);
  }

  /**
   * Logs form validation errors to the console.
   */
  logFormErrors() {
    console.log('Form Errors:', this.taskForm.errors);
    this.hideRequireDialog = true;
  }

  /**
   * Updates an existing task by submitting updated form data.
   * @param taskId - The ID of the task to update.
   */
  updateTask(taskId: number): void {
    this.taskService.updateTask(taskId, this.taskForm.value).subscribe({
      next: task => console.log('Task updated successfully:', task),
      error: error => console.error('Failed to update task:', error),
    });
  }

  /**
   * Prepares the form data for task submission, including formatting the due date
   * and structuring assigned contacts and subtasks.
   * @returns The formatted task data object.
   */
  prepareSubmitData() {
    const formData = this.taskForm.value;

    if (formData.due_date) {
      const { year, month, day } = formData.due_date;
      formData.due_date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    formData.assigned_to = this.selectedContacts;
    formData.subtasks = this.subtasks.map(subtask => ({
      id: subtask.id, // Include ID if present
      text: subtask.text,
      completed: subtask.completed,
    }));

    return formData;
  }

  /**
   * Closes the dialog that displays missing required fields.
   */
  closeRequireDialog() {
    this.hideRequireDialog = false;
  }
}
