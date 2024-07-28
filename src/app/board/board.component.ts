import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService, Task } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit  } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  awaitFeedbackTasks: Task[] = [];
  doneTasks: Task[] = [];
  categories: Category[] = [];
  contacts: Contact[] = [];
  maxVisibleContacts = 5;
  isOverlayVisible = false;
  
  isOverlayVisibleTask = false;
  selectedTask: Task | null = null;
  draggedTask: Task | null = null;
  searchTerm: string = '';
  originalTodoTasks: Task[] = []; // Store the original list of tasks
  originalInProgressTasks: Task[] = [];
  originalAwaitFeedbackTasks: Task[] = [];
  originalDoneTasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private addContactService: AddContactService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadCategories();
    this.loadContacts();
    console.log('Overlay visibility on init:', this.isOverlayVisibleTask);
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.categorizeTasks(tasks);
        this.originalTodoTasks = [...this.todoTasks];
        this.originalInProgressTasks = [...this.inProgressTasks];
        this.originalAwaitFeedbackTasks = [...this.awaitFeedbackTasks];
        this.originalDoneTasks = [...this.doneTasks];
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
    this.todoTasks = tasks.filter(task => task.status === 'todo').map(task => ({
      ...task,
      showStatusDropdown: false
    }));
    this.inProgressTasks = tasks.filter(task => task.status === 'inProgress').map(task => ({
      ...task,
      showStatusDropdown: false
    }));
    this.awaitFeedbackTasks = tasks.filter(task => task.status === 'awaitFeedback').map(task => ({
      ...task,
      showStatusDropdown: false
    }));
    this.doneTasks = tasks.filter(task => task.status === 'done').map(task => ({
      ...task,
      showStatusDropdown: false
    }));
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
    // console.log(`Contact fetched for ID ${contactId}:`, contact); // Debug log
    return contact;
}

  getInitials(name: string): string {
    return name.split(' ').map(part => part[0]).join('');
  }

  handleTaskAdded(): void {
    this.loadTasks(); // Reload tasks when a task is added
    setTimeout(() => this.isOverlayVisible = false, 1000);
  }

  openTaskOverlay(task: Task): void {
    
    this.selectedTask = task;
    this.isOverlayVisibleTask = true;
  }

 

  closeOverlay() {
    this.isOverlayVisible = false;
  }

  openOverlay() {
    this.isOverlayVisible = true;
  }


  closeTaskOverlay(): void {
    this.isOverlayVisibleTask = false;
    this.selectedTask = null;
  }

  handleTaskDeleted(): void {
    this.loadTasks(); // Reload tasks when a task is deleted
  }

  

  toggleStatusDropdown(task: Task, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the task card from opening
    task.showStatusDropdown = !task.showStatusDropdown;
  }




  changeStatus(task: Task, newStatus: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
  
    // Validate subtasks
    const validSubtasks = task.subtasks.filter(subtask => subtask.id != null);
    const updatedTask = { ...task, status: newStatus, subtasks: validSubtasks };
  
    this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe({
      next: (updatedTask) => {
        task.status = newStatus;
        task.showStatusDropdown = false;
        this.updateTaskInList(updatedTask);
        this.updateOriginalTasksArray(updatedTask); // Update the original task arrays
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to update task status:', error);
        alert('Failed to update task status: ' + (error.message || 'Something bad happened; please try again later.'));
      }
    });
  }
  
  updateTaskInList(updatedTask: Task) {
    const listMap: { [key: string]: Task[] } = {
      'todo': this.todoTasks,
      'inProgress': this.inProgressTasks,
      'awaitFeedback': this.awaitFeedbackTasks,
      'done': this.doneTasks,
    };
  
    for (const key of Object.keys(listMap)) {
      const list = listMap[key];
      const taskIndex = list.findIndex((task) => task.id === updatedTask.id);
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
  
  // New method to update original task arrays
  updateOriginalTasksArray(updatedTask: Task) {
    const listMap: { [key: string]: Task[] } = {
      'todo': this.originalTodoTasks,
      'inProgress': this.originalInProgressTasks,
      'awaitFeedback': this.originalAwaitFeedbackTasks,
      'done': this.originalDoneTasks,
    };
  
    for (const key of Object.keys(listMap)) {
      const list = listMap[key];
      const taskIndex = list.findIndex((task) => task.id === updatedTask.id);
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



  dragStarted(task: Task) {
    this.draggedTask = task;
    console.log('Task being dragged:', task);
  }


  drop(event: CdkDragDrop<Task[]>) {
    console.log('Previous container data:', event.previousContainer.data);
    console.log('Current container data:', event.container.data);
    console.log('Previous index:', event.previousIndex);
    console.log('Current index:', event.currentIndex);
  
    if (this.draggedTask) {
      console.log('Task being moved:', this.draggedTask);
      const newStatus = this.getStatusFromContainerId(event.container.id);
      console.log('New status:', newStatus);
  
      // Remove the task from the previous container
      const previousContainerIndex = event.previousContainer.data.findIndex(t => t.id === this.draggedTask!.id);
      if (previousContainerIndex > -1) {
        event.previousContainer.data.splice(previousContainerIndex, 1);
      }
  
      // Add the task to the new container and update its status
      this.changeStatus(this.draggedTask, newStatus);
      event.container.data.splice(event.currentIndex, 0, this.draggedTask);
      console.log('Task moved to new container:', this.draggedTask);
  
      this.draggedTask = null; // Reset the dragged task
  
      // Trigger change detection manually
      this.cdr.detectChanges();
    } else {
      console.error('Dragged task is null');
    }
  
    // Remove the highlight class from the container after drop
    event.container.element.nativeElement.classList.remove('highlight');
  
    // Log the updated state of containers
    console.log('Updated previous container data:', event.previousContainer.data);
    console.log('Updated current container data:', event.container.data);
  }

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

  highlight(event: CdkDragEnter<any>) {
    event.container.element.nativeElement.classList.add('highlight');
  }
  
  unhighlight(event: CdkDragExit<any>) {
    event.container.element.nativeElement.classList.remove('highlight');
  }


  searchTasks() {
    const searchTermLower = this.searchTerm.toLowerCase();
  
    this.todoTasks = this.originalTodoTasks.filter(task =>
      task.title.toLowerCase().includes(searchTermLower) || task.description!.toLowerCase().includes(searchTermLower)
    );
  
    this.inProgressTasks = this.originalInProgressTasks.filter(task =>
      task.title.toLowerCase().includes(searchTermLower) || task.description!.toLowerCase().includes(searchTermLower)
    );
  
    this.awaitFeedbackTasks = this.originalAwaitFeedbackTasks.filter(task =>
      task.title.toLowerCase().includes(searchTermLower) || task.description!.toLowerCase().includes(searchTermLower)
    );
  
    this.doneTasks = this.originalDoneTasks.filter(task =>
      task.title.toLowerCase().includes(searchTermLower) || task.description!.toLowerCase().includes(searchTermLower)
    );
  }
  

  closeUpdateTaskOverlay(): void {
    console.log('closeUpdateTaskOverlay method called');
    this.isOverlayVisibleTask= false;
    this.selectedTask = null;
    console.log('is closing working?',this.isOverlayVisibleTask)
    this.loadTasks();

  }

}