import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService, Task } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { SubtaskService, Subtask } from 'src/app/services/subtask.service';
import { Router } from '@angular/router';


/**
 * Component for editing a task, including details, subtasks, and assigned contacts.
 * Supports form validation, updates, and emits events upon task modifications.
 */
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit, OnChanges {

  /** Date input element reference for task due date. */
  @ViewChild('dpInput') dpInput!: ElementRef<HTMLInputElement>;

  /** Minimum date allowed for task due date selection. */
  minDate!: NgbDateStruct;

  /** Reactive form group for task details. */
  taskForm: FormGroup;

  /** Subtask input element reference. */
  @ViewChild('subtaskInput') subtaskInput!: ElementRef<HTMLInputElement>;

  /** List of available task categories. */
  categories: Category[] = [];

  /** Selected category for the task. */
  selectedOption?: Category;

  /** Controls visibility of the category dropdown. */
  isOpen = false;

  /** Controls visibility of the edit task component. */
  @Input() isEditTaskVisible: boolean = false;

  /** Controls overlay visibility for the task edit view. */
  @Input() isOverlayVisibleTask: boolean = false;

  /** Controls visibility of header and footer in the component. */
  @Input() hideHeaderFooter: boolean = false;

  /** Custom height for the task component. */
  @Input() height: string = '100%';

  /** Custom width for the task component. */
  @Input() width: string = '100%';

  /** Task ID for the task to be edited. */
  @Input() taskId!: number; 

  /** Event emitted when the task is successfully updated. */
  @Output() taskUpdated = new EventEmitter<void>();

  /** Event emitted to close the task edit overlay. */
  @Output() closeEditTaskOverlay = new EventEmitter<void>();

  /** Event emitted to close the update task overlay. */
  @Output() closeUpdateTaskOverlay = new EventEmitter<void>();

  /** Event emitted when the task is updated and the overlay is closed. */
  @Output() taskUpdatedAndClosed = new EventEmitter<void>();

  /** Task object containing details of the task to be edited. */
  @Input() task: Task | null = null;

  /** Flag indicating if the task was added successfully. */
  addTaskSuccess = false;

  /** List of contacts available for task assignment. */
  contacts: Contact[] = [];

  /** Currently selected contact for assignment. */
  selectedContact: Contact | null = null;

  /** Controls visibility of the contacts dropdown. */
  isOpenContacts = false;

  /** List of selected contact IDs for the task. */
  selectedContacts: number[] = [];

  /** Maximum number of visible contacts in the dropdown. */
  maxVisibleContacts: number = 3;

  /** Boolean tracking input focus state for contact selection. */
  isInputFocused: boolean = false;

  /** List of subtasks associated with the task. */
  subtasks: Subtask[] = [];

  /** Holds the text of a new subtask being added. */
  newSubtask: string = '';


    /**
   * Constructor to inject services for managing tasks, categories, contacts, subtasks, date formatting, and routing.
   * @param ngbDateParserFormatter - Service for parsing date structures.
   * @param addContactService - Service for managing contacts.
   * @param fb - FormBuilder for creating reactive forms.
   * @param categoryService - Service for fetching task categories.
   * @param taskService - Service for managing tasks.
   * @param subtaskService - Service for managing subtasks.
   * @param router - Angular Router for navigation.
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
      category: [null, Validators.required],
      priority: ['', Validators.required],
      due_date: [null, Validators.required],
      assigned_to: [[]],
      status: ['todo', Validators.required],
    });
  }


    /**
   * Initializes the component by setting the minimum date, loading contacts and categories,
   * and fetching task details if a task ID is provided.
   */
  ngOnInit(): void {
    const today = new Date();
    this.minDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.loadContacts();
    this.loadCategories();

    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
      error: error => {
        console.error('Error fetching categories:', error);
      },
    });

    if (this.taskId) {
      this.loadTask(this.taskId);
    } else if (this.task) {
      this.setTaskFormData(this.task);
    }
  }


    /**
   * Detects changes to input properties, especially the `task`, and loads new task data if changed.
   * @param changes - Object containing the changes in component input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && changes['task'].currentValue) {
      this.taskId = changes['task'].currentValue.id; 
      this.setTaskFormData(changes['task'].currentValue);
    }
  }


  /**
 * Loads available categories from the CategoryService and sets the task form data if a task is provided.
 */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
        if (this.task) {
          this.setTaskFormData(this.task); 
        }
      },
      error: error => {
        console.error('Error fetching categories:', error);
      },
    });
  }


  /**
 * Formats the selected date and sets it in the task form.
 * @param date - The selected date in NgbDateStruct format.
 */
  onDateSelect(date: NgbDateStruct): void {
    const formattedDate = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    this.dpInput.nativeElement.value = formattedDate;
    this.taskForm.get('due_date')?.setValue(formattedDate);
  }


  /** Toggles the visibility of the category dropdown. */

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }


  /** Toggles the visibility of the contacts dropdown. */
  toggleDropdownContacts(): void {
    this.isOpenContacts = !this.isOpenContacts;
  }


  /**
 * Sets the selected category in the form and closes the dropdown.
 * @param category - The selected category.
 * @param event - The mouse event to stop propagation.
 */
  selectOption(category: Category, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedOption = category;
    this.taskForm.get('category')?.setValue(category.id);
    this.isOpen = false;
  }


  /**
 * Sets the selected contact and closes the contacts dropdown.
 * @param contact - The selected contact.
 * @param event - The mouse event to stop propagation.
 */
  selectContact(contact: Contact, event: MouseEvent): void {
    this.selectedContact = contact;
    this.isOpenContacts = false;
    event.stopPropagation();
  }


  /**
 * Loads contacts from the AddContactService and sets them for selection in the form.
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
 * Generates initials from a contact's name for display purposes.
 * @param name - The name of the contact.
 * @returns The initials of the contact's name.
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
 * Toggles the selection of a contact in the assigned contacts list.
 * @param contactId - The ID of the contact to toggle.
 * @param isChecked - Boolean indicating if the contact is selected or deselected.
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
 * Handles click events for selecting a contact and toggles their selection state.
 * @param contactId - ID of the contact to handle.
 * @param event - The mouse event to stop propagation.
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
 * Finds a contact by ID from the list of loaded contacts.
 * @param contactId - The ID of the contact to retrieve.
 * @returns The Contact object if found, or undefined.
 */
  getContactById(contactId: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === contactId);
  }


  /**
 * Toggles the visibility of input icons based on focus.
 * @param focused - Boolean indicating if the input is focused.
 */
  toggleIcons(focused: boolean): void {
    if (!focused) {
      setTimeout(() => (this.isInputFocused = focused), 100);
    } else {
      this.isInputFocused = focused;
    }
  }


  /**
 * Adds a new subtask to the task.
 * @param event - The mouse event to prevent default.
 * @param subtaskValue - The text of the new subtask.
 */
  addSubtask(event: MouseEvent, subtaskValue: string): void {
    event.preventDefault();
    const trimmedValue = subtaskValue.trim();
    if (trimmedValue) {
      const newSubtask = { text: trimmedValue, completed: false }; 
      this.subtasks.push(newSubtask);
      this.clearInput();
    }
  }


  /** Clears the subtask input field. */

  clearInput(): void {
    this.subtaskInput.nativeElement.value = '';
  }


  /**
 * Deletes a subtask from the task based on its index.
 * @param index - Index of the subtask to delete.
 */
  deleteSubtask(index: number): void {
    this.subtasks.splice(index, 1);
  }


  /**
 * Edits an existing subtask and updates it in the backend if it has an ID.
 * @param index - Index of the subtask to edit.
 * @param subtaskText - Current text of the subtask for editing.
 */
  editSubtask(index: number, subtaskText: string): void {
    const editedSubtaskText = prompt('Edit Subtask:', subtaskText);
    if (editedSubtaskText !== null && editedSubtaskText.trim() !== '') {
      const subtask = this.subtasks[index];
      if (subtask) {
        subtask.text = editedSubtaskText.trim();

        if (subtask.id !== undefined) {
          this.subtaskService.updateSubtask(subtask.id, subtask).subscribe({
            next: updatedSubtask => {},
            error: error => {
              console.error('Failed to update subtask:', error);
              alert('Failed to update subtask. Please try again.');
            },
          });
        } else {
          this.subtasks[index] = subtask;
        }
      } else {
        console.error('Subtask not found, cannot update.');
        alert('Subtask cannot be updated as it was not found.');
      }
    }
  }


  /**
 * Loads a task by ID and sets the data in the form.
 * @param taskId - The ID of the task to load.
 */
  loadTask(taskId: number): void {
    this.taskService.getTask(taskId).subscribe({
      next: task => {
        this.setTaskFormData(task);
      },
      error: error => {
        console.error('Failed to load task:', error);
      },
    });
  }


  /**
 * Sets the form data with the task details.
 * @param task - Task object containing details to populate the form.
 */
  setTaskFormData(task: Task): void {
    if (task.due_date) {
      const date = new Date(task.due_date);
      const formattedDate: NgbDateStruct = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
      this.taskForm.get('due_date')?.setValue(formattedDate);
    }

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      assigned_to: task.assigned_to,
      status: task.status,
    });

    this.selectedOption = this.categories.find(category => category.id === task.category);
    this.selectedContacts = task.assigned_to ? [...task.assigned_to] : [];
    this.subtasks = task.subtasks;
  }


  /**
 * Updates the task with form data and clears the form upon success.
 */
  updateTask(): void {
    if (!this.taskForm.valid) {
      this.logFormErrors();
      return;
    }

    const formattedData = this.prepareSubmitData();

    this.taskService.updateTask(this.taskId, formattedData).subscribe({
      next: task => {
        this.taskForm.reset();
        this.subtasks = [];
        this.addTaskSuccess = true;
      },
      error: error => {
        console.error('Failed to update task:', error);
        console.error('Error details:', error.error);
        alert('Failed to update task: ' + (error.error.message || error.message));
      },
    });

    setTimeout(() => {
      this.taskUpdated.emit();
      this.router.navigate(['/board']);

      this.closeUpdateTaskOverlay.emit();
      this.taskUpdatedAndClosed.emit();
    }, 3000);
  }


  /** Logs validation errors for each control in the form. */
  logFormErrors() {
    const formErrors: { [key: string]: any } = {};
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      if (control && control.invalid) {
        formErrors[key] = control.errors; 
      }
    });

    if (Object.keys(formErrors).length > 0) {
      console.error('Form Errors:', formErrors); 
    }

    return formErrors; 
  }


  /**
 * Prepares the form data for submission, formatting the date and subtasks.
 * @returns The formatted task data.
 */
  prepareSubmitData() {
    const formData = this.taskForm.value;

    if (formData.due_date) {
      const { year, month, day } = formData.due_date;
      formData.due_date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    formData.assigned_to = this.selectedContacts;

    formData.subtasks = this.subtasks.map(subtask => ({
      id: subtask.id || null, 
      text: subtask.text,
      completed: subtask.completed,
    }));

    return formData;
  }


  /** Emits an event to close the edit task overlay. */
  onCloseEditTaskOverlay(): void {
    this.closeEditTaskOverlay.emit();
  }
}
