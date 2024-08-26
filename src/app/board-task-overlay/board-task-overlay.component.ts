import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService, Task } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { SubtaskService, Subtask } from 'src/app/services/subtask.service';

@Component({
  selector: 'app-board-task-overlay',
  templateUrl: './board-task-overlay.component.html',
  styleUrls: ['./board-task-overlay.component.scss']
})
export class BoardTaskOverlayComponent implements OnInit {
  @Input() selectedTask: Task | null = null;
  @Input() isOverlayVisibleTask: boolean = false;
  @Output() closeTaskOverlay = new EventEmitter<void>();
  @Output() taskDeleted = new EventEmitter<void>();
  @Output() taskUpdatedAndClosed = new EventEmitter<void>();

  isEditTaskVisible = false;
  isTaskOverlayContainerVisible = true;
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  awaitFeedbackTasks: Task[] = [];
  doneTasks: Task[] = [];
  categories: Category[] = [];
  contacts: Contact[] = [];
  maxVisibleContacts = 5;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private addContactService: AddContactService,
    private subtaskService: SubtaskService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadCategories();
    this.loadContacts();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.categorizeTasks(tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadContacts(): void {
    this.addContactService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
      }
    });
  }

  categorizeTasks(tasks: Task[]): void {
    this.todoTasks = tasks.filter(task => task.status === 'todo');
    this.inProgressTasks = tasks.filter(task => task.status === 'inProgress');
    this.awaitFeedbackTasks = tasks.filter(task => task.status === 'awaitFeedback');
    this.doneTasks = tasks.filter(task => task.status === 'done');
  }

  getCategoryNameAndColor(categoryId: number): { name: string, color: string } {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? { name: category.name, color: category.color } : { name: 'Unknown', color: '#000000' };
  }

  getSubtaskCompletion(task: Task): string {
    if (!task.subtasks || task.subtasks.length === 0) return '';
    const completed = task.subtasks.filter(subtask => subtask.completed).length;
    return `${completed}/${task.subtasks.length}`;
  }

  getSubtaskCompletionPercentage(task: Task): number {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(subtask => subtask.completed).length;
    return (completed / task.subtasks.length) * 100;
  }

  getContactById(contactId: number): Contact | undefined {
    const contact = this.contacts.find(contact => contact.id === contactId);
    return contact;
  }

  getInitials(name: string): string {
    return name.split(' ').map(part => part[0]).join('');
  }

  onCloseTaskOverlay(): void {
    this.closeTaskOverlay.emit();
  }

  toggleSubtaskCompletion(subtask: Subtask): void {
    subtask.completed = !subtask.completed;
    this.subtaskService.updateSubtask(subtask.id!, subtask).subscribe({
      next: (updatedSubtask) => {
        console.log('Subtask updated successfully:', updatedSubtask);
      },
      error: (error) => {
        console.error('Error updating subtask:', error);
      }
    });
  }

  deleteTask(): void {
    if (this.selectedTask) {
      this.taskService.deleteTask(this.selectedTask.id!).subscribe({
        next: () => {
          this.taskDeleted.emit(); // Emit the taskDeleted event
          this.onCloseTaskOverlay();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }
  openEditTaskOverlay() {
    this.isEditTaskVisible = true;
    this.isTaskOverlayContainerVisible = false;
  }

  closeEditTaskOverlay(): void {
    this.isEditTaskVisible = false;
    this.selectedTask = null;
  }

  onTaskUpdated(): void {
    this.loadTasks(); // Reload tasks to reflect the updates
    this.isEditTaskVisible = false; // Hide the edit task overlay
  }

  handleTaskUpdatedAndClosed(): void {
    this.isOverlayVisibleTask = false;
    this.selectedTask = null;
    this.closeTaskOverlay.emit();
    this.taskUpdatedAndClosed.emit();
  }
}
