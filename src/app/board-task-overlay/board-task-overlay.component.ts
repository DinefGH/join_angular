import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService, Task } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { SubtaskService, Subtask } from 'src/app/services/subtask.service';


/**
 * Component to display and manage task details within an overlay.
 * Allows editing, viewing, and deleting tasks, along with managing subtasks.
 */
@Component({
  selector: 'app-board-task-overlay',
  templateUrl: './board-task-overlay.component.html',
  styleUrls: ['./board-task-overlay.component.scss'],
})
export class BoardTaskOverlayComponent implements OnInit {

    /** The currently selected task to display in the overlay. */
  @Input() selectedTask: Task | null = null;

  /** Boolean to control the visibility of the task overlay. */
  @Input() isOverlayVisibleTask: boolean = false;

  /** Event emitted when the overlay is closed. */
  @Output() closeTaskOverlay = new EventEmitter<void>();

  /** Event emitted when a task is deleted. */
  @Output() taskDeleted = new EventEmitter<void>();

  /** Event emitted when a task is updated and the overlay is closed. */
  @Output() taskUpdatedAndClosed = new EventEmitter<void>();

  /** Controls the visibility of the edit task overlay. */
  isEditTaskVisible = false;

  /** Controls the visibility of the task overlay container. */
  isTaskOverlayContainerVisible = true;


    /** Arrays to hold categorized tasks based on their statuses. */
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  awaitFeedbackTasks: Task[] = [];
  doneTasks: Task[] = [];

  /** List of available categories for tasks. */
  categories: Category[] = [];

  /** List of contacts available for task assignment. */
  contacts: Contact[] = [];

  /** Maximum number of contacts displayed within a task overlay. */
  maxVisibleContacts = 5;


    /**
   * Constructor to inject necessary services for managing tasks, categories, contacts, and subtasks.
   * @param taskService - Service for managing tasks.
   * @param categoryService - Service for managing task categories.
   * @param addContactService - Service for handling contacts.
   * @param subtaskService - Service for managing subtasks.
   */

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private addContactService: AddContactService,
    private subtaskService: SubtaskService,
  ) {}


    /**
   * Initializes the component by loading tasks, categories, and contacts.
   */
  ngOnInit(): void {
    this.loadTasks();
    this.loadCategories();
    this.loadContacts();
  }


    /**
   * Loads tasks from the TaskService and categorizes them.
   */
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.categorizeTasks(tasks);
      },
      error: error => {
        console.error('Error loading tasks:', error);
      },
    });
  }


    /**
   * Loads task categories from the CategoryService.
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
      error: error => {
        console.error('Error loading categories:', error);
      },
    });
  }


    /**
   * Loads contacts from the AddContactService.
   */
  loadContacts(): void {
    this.addContactService.getContacts().subscribe({
      next: contacts => {
        this.contacts = contacts;
      },
      error: error => {
        console.error('Error loading contacts:', error);
      },
    });
  }


    /**
   * Categorizes tasks into lists based on their status.
   * @param tasks - Array of tasks to be categorized.
   */
  categorizeTasks(tasks: Task[]): void {
    this.todoTasks = tasks.filter(task => task.status === 'todo');
    this.inProgressTasks = tasks.filter(task => task.status === 'inProgress');
    this.awaitFeedbackTasks = tasks.filter(task => task.status === 'awaitFeedback');
    this.doneTasks = tasks.filter(task => task.status === 'done');
  }


    /**
   * Retrieves the name and color of a category by ID.
   * @param categoryId - ID of the category.
   * @returns An object containing the name and color of the category.
   */
  getCategoryNameAndColor(categoryId: number): { name: string; color: string } {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category
      ? { name: category.name, color: category.color }
      : { name: 'Unknown', color: '#000000' };
  }


    /**
   * Calculates the number of completed subtasks for a task.
   * @param task - Task containing subtasks.
   * @returns A string with the count of completed subtasks out of the total.
   */
  getSubtaskCompletion(task: Task): string {
    if (!task.subtasks || task.subtasks.length === 0) return '';
    const completed = task.subtasks.filter(subtask => subtask.completed).length;
    return `${completed}/${task.subtasks.length}`;
  }


    /**
   * Calculates the percentage of completed subtasks for a task.
   * @param task - Task to calculate subtask completion percentage for.
   * @returns The percentage of completed subtasks.
   */
  getSubtaskCompletionPercentage(task: Task): number {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(subtask => subtask.completed).length;
    return (completed / task.subtasks.length) * 100;
  }


    /**
   * Retrieves a contact by their ID.
   * @param contactId - ID of the contact.
   * @returns The Contact object if found, otherwise undefined.
   */
  getContactById(contactId: number): Contact | undefined {
    const contact = this.contacts.find(contact => contact.id === contactId);
    return contact;
  }


    /**
   * Generates initials from a contact's name.
   * @param name - Full name of the contact.
   * @returns Initials derived from the contact's name.
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  }


    /**
   * Closes the task overlay and emits an event to notify the parent component.
   */
  onCloseTaskOverlay(): void {
    this.closeTaskOverlay.emit();
  }


    /**
   * Toggles the completion status of a subtask and updates it in the backend.
   * @param subtask - Subtask to toggle completion for.
   */
  toggleSubtaskCompletion(subtask: Subtask): void {
    subtask.completed = !subtask.completed;
    this.subtaskService.updateSubtask(subtask.id!, subtask).subscribe({
      next: updatedSubtask => {},
      error: error => {
        console.error('Error updating subtask:', error);
      },
    });
  }


    /**
   * Deletes the selected task and emits an event on successful deletion.
   */
  deleteTask(): void {
    if (this.selectedTask) {
      this.taskService.deleteTask(this.selectedTask.id!).subscribe({
        next: () => {
          this.taskDeleted.emit(); 
          this.onCloseTaskOverlay();
        },
        error: error => {
          console.error('Error deleting task:', error);
        },
      });
    }
  }


    /**
   * Opens the edit task overlay, hiding the main task overlay container.
   */
  openEditTaskOverlay() {
    this.isEditTaskVisible = true;
    this.isTaskOverlayContainerVisible = false;
  }


    /**
   * Closes the edit task overlay and clears the selected task.
   */
  closeEditTaskOverlay(): void {
    this.isEditTaskVisible = false;
    this.selectedTask = null;
  }


    /**
   * Updates the task list after a task is edited and closes the edit overlay.
   */
  onTaskUpdated(): void {
    this.loadTasks(); 
    this.isEditTaskVisible = false; 
  }


    /**
   * Closes the task overlay, clears the selected task, and emits events to notify the parent component.
   */
  handleTaskUpdatedAndClosed(): void {
    this.isOverlayVisibleTask = false;
    this.selectedTask = null;
    this.closeTaskOverlay.emit();
    this.taskUpdatedAndClosed.emit();
  }
}
