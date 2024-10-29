import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService, Task } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragEnter,
  CdkDragExit,
} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';

/**
 * Component representing the task board, displaying tasks in different statuses and allowing drag-and-drop functionality.
 */
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  

    /** Array of tasks in the 'To Do' column */
  todoTasks: Task[] = [];

/** Array of tasks in the 'In Progress' column */
  inProgressTasks: Task[] = [];

/** Array of tasks in the 'Await Feedback' column */
  awaitFeedbackTasks: Task[] = [];

  /** Array of tasks in the 'Done' column */
  doneTasks: Task[] = [];

  /** List of available categories for tasks */
  categories: Category[] = [];

  /** List of available contacts for assignment to tasks */
  contacts: Contact[] = [];

  /** Maximum number of visible contacts in a task card, additional contacts are hidden */
  maxVisibleContacts = 5;

  /** Controls visibility of the overlay for additional task details */
  isOverlayVisible = false;

  /** Controls visibility of a detailed task overlay */

  isOverlayVisibleTask = false;

  /** Currently selected task for displaying additional details */
  selectedTask: Task | null = null;

  /** Task currently being dragged during a drag-and-drop operation */
  draggedTask: Task | null = null;

  /** Search term for filtering tasks based on title or description */
  searchTerm: string = '';

  /** Original list of 'To Do' tasks, stored for reset and filtering */
  originalTodoTasks: Task[] = [];

  /** Original list of 'In Progress' tasks, stored for reset and filtering */
  originalInProgressTasks: Task[] = [];

  /** Original list of 'Await Feedback' tasks, stored for reset and filtering */
  originalAwaitFeedbackTasks: Task[] = [];

  /** Original list of 'Done' tasks, stored for reset and filtering */
  originalDoneTasks: Task[] = [];


    /**
   * Constructor that injects necessary services for managing tasks, categories, contacts, and change detection.
   * @param taskService - Service to manage tasks, including retrieval and updates.
   * @param categoryService - Service for retrieving available task categories.
   * @param addContactService - Service for managing contacts associated with tasks.
   * @param cdr - ChangeDetectorRef for manually triggering change detection.
   */
  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private addContactService: AddContactService,
    private cdr: ChangeDetectorRef,
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
 * Loads tasks from the TaskService and categorizes them based on their status.
 */
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.categorizeTasks(tasks);
        this.originalTodoTasks = [...this.todoTasks];
        this.originalInProgressTasks = [...this.inProgressTasks];
        this.originalAwaitFeedbackTasks = [...this.awaitFeedbackTasks];
        this.originalDoneTasks = [...this.doneTasks];
      },
      error: error => {
        console.error('Error loading tasks:', error);
      },
    });
  }


  /**
 * Loads categories from the CategoryService.
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
 * Categorizes tasks into arrays based on their status for displaying in columns.
 * @param tasks - Array of tasks to categorize.
 */
  categorizeTasks(tasks: Task[]): void {
    this.todoTasks = tasks
      .filter(task => task.status === 'todo')
      .map(task => ({
        ...task,
        showStatusDropdown: false,
      }));
    this.inProgressTasks = tasks
      .filter(task => task.status === 'inProgress')
      .map(task => ({
        ...task,
        showStatusDropdown: false,
      }));
    this.awaitFeedbackTasks = tasks
      .filter(task => task.status === 'awaitFeedback')
      .map(task => ({
        ...task,
        showStatusDropdown: false,
      }));
    this.doneTasks = tasks
      .filter(task => task.status === 'done')
      .map(task => ({
        ...task,
        showStatusDropdown: false,
      }));
  }


  /**
 * Retrieves the name and color of a category by its ID.
 * @param categoryId - The ID of the category.
 * @returns An object containing the category name and color.
 */
  getCategoryNameAndColor(categoryId: number): { name: string; color: string } {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category
      ? { name: category.name, color: category.color }
      : { name: 'Unknown', color: '#000000' };
  }


  /**
 * Retrieves the completion status of subtasks for a task.
 * @param task - The task for which to calculate subtask completion.
 * @returns A string indicating the number of completed subtasks out of the total.
 */
  getSubtaskCompletion(task: Task): string {
    if (!task.subtasks || task.subtasks.length === 0) return '';
    const completed = task.subtasks.filter(subtask => subtask.completed).length;
    return `${completed}/${task.subtasks.length}`;
  }


  /**
 * Calculates the completion percentage of subtasks for a task.
 * @param task - The task for which to calculate the subtask completion percentage.
 * @returns The percentage of completed subtasks.
 */
  getSubtaskCompletionPercentage(task: Task): number {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(subtask => subtask.completed).length;
    return (completed / task.subtasks.length) * 100;
  }


  /**
 * Finds a contact by their ID.
 * @param contactId - The ID of the contact to retrieve.
 * @returns The Contact object if found, otherwise undefined.
 */
  getContactById(contactId: number): Contact | undefined {
    const contact = this.contacts.find(contact => contact.id === contactId);
    return contact;
  }


  /**
 * Generates initials for a contact name.
 * @param name - The name from which to generate initials.
 * @returns The initials as a string.
 */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  }


  /**
 * Handles task addition by reloading tasks and closing the overlay.
 */
  handleTaskAdded(): void {
    this.loadTasks(); // Reload tasks when a task is added
    setTimeout(() => (this.isOverlayVisible = false), 1000);
  }


  /**
 * Opens the task details overlay for a specific task.
 * @param task - The task to display in the overlay.
 */
  openTaskOverlay(task: Task): void {
    this.selectedTask = task;
    this.isOverlayVisibleTask = true;
  }


  /**
 * Closes the overlay for task addition or editing.
 */
  closeOverlay() {
    this.isOverlayVisible = false;
  }


  /**
 * Opens the overlay for task addition or editing.
 */
  openOverlay() {
    this.isOverlayVisible = true;
  }


  /**
 * Closes the task details overlay.
 */
  closeTaskOverlay(): void {
    this.isOverlayVisibleTask = false;
    this.selectedTask = null;
  }


  /**
 * Handles task deletion by reloading tasks.
 */
  handleTaskDeleted(): void {
    this.loadTasks(); 
  }


  /**
 * Toggles the visibility of the status dropdown for a specific task.
 * @param task - The task for which to toggle the status dropdown.
 * @param event - The MouseEvent to prevent propagation.
 */
  toggleStatusDropdown(task: Task, event: MouseEvent): void {
    event.stopPropagation(); 
    task.showStatusDropdown = !task.showStatusDropdown;
  }



  /**
 * Changes the status of a task and updates its position in the board.
 * @param task - The task to change status for.
 * @param newStatus - The new status for the task.
 * @param event - Optional MouseEvent to stop propagation if provided.
 */
  changeStatus(task: Task, newStatus: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    const oldStatus = task.status || '';

    const validSubtasks = task.subtasks.filter(subtask => subtask.id != null);
    const updatedTask = { ...task, status: newStatus, subtasks: validSubtasks };

    this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe({
      next: updatedTask => {
        this.removeTaskFromCurrentList(task, oldStatus);

        task.status = newStatus;
        task.showStatusDropdown = false;

        this.addTaskToNewList(task);

        this.updateOriginalTasksArray(updatedTask);

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to update task status:', error);
        alert(
          'Failed to update task status: ' +
            (error.message || 'Something bad happened; please try again later.'),
        );
      },
    });
  }



  /**
 * Removes a task from its current status list based on the previous status.
 * @param task - The task to remove.
 * @param oldStatus - The previous status of the task.
 */
  removeTaskFromCurrentList(task: Task, oldStatus: string): void {
    switch (oldStatus) {
      case 'todo':
        this.todoTasks = this.todoTasks.filter(t => t.id !== task.id);
        break;
      case 'inProgress':
        this.inProgressTasks = this.inProgressTasks.filter(t => t.id !== task.id);
        break;
      case 'awaitFeedback':
        this.awaitFeedbackTasks = this.awaitFeedbackTasks.filter(t => t.id !== task.id);
        break;
      case 'done':
        this.doneTasks = this.doneTasks.filter(t => t.id !== task.id);
        break;
    }
  }


  /**
 * Adds a task to the new status list based on its updated status.
 * @param task - The task to add to the list.
 */
  addTaskToNewList(task: Task): void {
    switch (task.status) {
      case 'todo':
        this.todoTasks.push(task);
        break;
      case 'inProgress':
        this.inProgressTasks.push(task);
        break;
      case 'awaitFeedback':
        this.awaitFeedbackTasks.push(task);
        break;
      case 'done':
        this.doneTasks.push(task);
        break;
    }
  }


  /**
 * Updates a task in the appropriate list based on its current status.
 * @param updatedTask - The updated task object to replace in the list.
 */
  updateTaskInList(updatedTask: Task) {
    const listMap: { [key: string]: Task[] } = {
      todo: this.todoTasks,
      inProgress: this.inProgressTasks,
      awaitFeedback: this.awaitFeedbackTasks,
      done: this.doneTasks,
    };

    for (const key of Object.keys(listMap)) {
      const list = listMap[key];
      const taskIndex = list.findIndex(task => task.id === updatedTask.id);
      if (taskIndex !== -1) {
        list[taskIndex] = updatedTask;
        return;
      }
    }

    if (updatedTask.status && updatedTask.status in listMap) {
      listMap[updatedTask.status].push(updatedTask);
    } else {
      console.error('Unknown or undefined task status:', updatedTask.status);
    }
  }


  /**
 * Updates the task in the original task lists for search functionality.
 * @param updatedTask - The updated task object to replace in the original list.
 */
  updateOriginalTasksArray(updatedTask: Task) {
    const listMap: { [key: string]: Task[] } = {
      todo: this.originalTodoTasks,
      inProgress: this.originalInProgressTasks,
      awaitFeedback: this.originalAwaitFeedbackTasks,
      done: this.originalDoneTasks,
    };

    for (const key of Object.keys(listMap)) {
      const list = listMap[key];
      const taskIndex = list.findIndex(task => task.id === updatedTask.id);
      if (taskIndex !== -1) {
        list[taskIndex] = updatedTask;
        return;
      }
    }

    if (updatedTask.status && updatedTask.status in listMap) {
      listMap[updatedTask.status].push(updatedTask);
    } else {
      console.error('Unknown or undefined task status:', updatedTask.status);
    }
  }


  /**
 * Initiates dragging of a task by setting it as the currently dragged task.
 * @param task - The task being dragged.
 */
  dragStarted(task: Task) {
    this.draggedTask = task;
  }


  /**
 * Handles the drop event to update the task's status and position based on drag-and-drop.
 * @param event - The CdkDragDrop event containing drag-and-drop details.
 */
  drop(event: CdkDragDrop<Task[]>) {
    if (this.draggedTask) {
      const newStatus = this.getStatusFromContainerId(event.container.id);
      const previousContainerIndex = event.previousContainer.data.findIndex(
        t => t.id === this.draggedTask!.id,
      );
      if (previousContainerIndex > -1) {
        event.previousContainer.data.splice(previousContainerIndex, 1);
      }

      this.changeStatus(this.draggedTask, newStatus);

      this.draggedTask = null; 

      
      this.cdr.detectChanges();
    } else {
      console.error('Dragged task is null');
    }

    event.container.element.nativeElement.classList.remove('highlight');

  }


  /**
 * Determines the status of a task based on the container ID.
 * @param containerId - The ID of the container to map to a status.
 * @returns The status string based on the container ID.
 */
  getStatusFromContainerId(containerId: string): string {
    switch (containerId) {
      case 'todoContainer':
        return 'todo';
      case 'inProgressContainer':
        return 'inProgress';
      case 'awaitFeedbackContainer':
        return 'awaitFeedback';
      case 'doneContainer':
        return 'done';
      default:
        return '';
    }
  }


  /**
 * Highlights a container when a task is dragged over it.
 * @param event - The CdkDragEnter event to trigger highlight.
 */
  highlight(event: CdkDragEnter<any>) {
    event.container.element.nativeElement.classList.add('highlight');
  }


  /**
 * Removes highlight from a container when a task is dragged out.
 * @param event - The CdkDragExit event to remove highlight.
 */
  unhighlight(event: CdkDragExit<any>) {
    event.container.element.nativeElement.classList.remove('highlight');
  }


  /**
 * Searches tasks across all lists based on the current search term, filtering by title and description.
 */
  searchTasks() {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.todoTasks = this.originalTodoTasks.filter(
      task =>
        task.title.toLowerCase().includes(searchTermLower) ||
        task.description!.toLowerCase().includes(searchTermLower),
    );

    this.inProgressTasks = this.originalInProgressTasks.filter(
      task =>
        task.title.toLowerCase().includes(searchTermLower) ||
        task.description!.toLowerCase().includes(searchTermLower),
    );

    this.awaitFeedbackTasks = this.originalAwaitFeedbackTasks.filter(
      task =>
        task.title.toLowerCase().includes(searchTermLower) ||
        task.description!.toLowerCase().includes(searchTermLower),
    );

    this.doneTasks = this.originalDoneTasks.filter(
      task =>
        task.title.toLowerCase().includes(searchTermLower) ||
        task.description!.toLowerCase().includes(searchTermLower),
    );
  }


  /**
 * Closes the update task overlay, resets the selected task, and reloads tasks.
 */
  closeUpdateTaskOverlay(): void {
    this.isOverlayVisibleTask = false;
    this.selectedTask = null;
    this.loadTasks();
  }
}
