import { Component, OnInit, Input } from '@angular/core';
import { TaskService, Task } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';

@Component({
  selector: 'app-board-task-overlay',
  templateUrl: './board-task-overlay.component.html',
  styleUrls: ['./board-task-overlay.component.scss']
})
export class BoardTaskOverlayComponent {
  @Input() selectedTask: Task | null = null;
  @Input() isOverlayVisibleTask: boolean = false;
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
    private addContactService: AddContactService
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
        console.log('Contacts loaded:', this.contacts); // Debug log
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
    console.log(`Contact fetched for ID ${contactId}:`, contact); // Debug log
    return contact;
}

  getInitials(name: string): string {
    return name.split(' ').map(part => part[0]).join('');
  }

  closeTaskOverlay(): void {
    this.isOverlayVisibleTask = false;
    this.selectedTask = null;
  }

}
