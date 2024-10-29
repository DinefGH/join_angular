import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/assets/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskService, Task } from 'src/app/services/task.service';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';


/**
 * SummaryComponent displays a summary view for the user, including
 * a greeting, tasks overview, and nearest task due date.
 */
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {

    /** Current date displayed in the summary view. */
  currentDate = new Date();

    /** Observable to dynamically display a greeting based on the time of day. */
  greeting$: Observable<string> | undefined;

    /** The currently logged-in user, retrieved from the UserService. */
  currentUser: User | null = null;

    /** List of tasks retrieved from the TaskService. */
  tasks: Task[] = [];

    /** Nearest task due date among all tasks, calculated after loading tasks. */
  nearestDueDate: Date | null = null;

    /** Boolean to control the display of an introductory overlay in the summary. */
  showOverlaySummary: boolean = true;


    /**
   * Constructor to inject necessary services, including UserService, TaskService, and Router.
   * @param userService - Service to manage user data.
   * @param taskService - Service to manage tasks data.
   * @param router - Router for navigation within the app.
   */
  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private router: Router,
  ) {}


    /**
   * Initializes the component, loads tasks, sets up greeting, and manages the overlay.
   */
  ngOnInit(): void {
    const showOverlayStored = sessionStorage.getItem('showOverlaySummary');
    console.log(this.showOverlaySummary);
    this.loadTasks();
    this.greeting$ = this.userService
      .getCurrentUser()
      .pipe(map(user => this.generateGreeting(user)));

    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    if (showOverlayStored === 'true') {
      this.showOverlaySummary = true;

      setTimeout(() => {
        sessionStorage.setItem('showOverlaySummary', 'false');
        this.showOverlaySummary = false;
      }, 5000);
    } else {
      this.showOverlaySummary = false;
    }
  }


    /**
   * Generates a greeting message based on the current time of day.
   * @param user - The current user to personalize the greeting.
   * @returns A greeting string (e.g., "Good morning,").
   */
  private generateGreeting(user: User | null): string {
    const now = new Date();
    const hour = now.getHours();

    let greeting = 'Hello,';

    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning,';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon,';
    } else {
      greeting = 'Good evening,';
    }

    return greeting;
  }


    /**
   * Loads tasks from the server and calculates the nearest due date.
   */
  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      tasks => {
        this.tasks = tasks;
        this.findNearestDueDate();
      },
      error => {
        console.error('Error loading tasks:', error);
      },
    );
  }


    /**
   * Counts tasks by their status (e.g., "todo", "done").
   * @param status - The status of tasks to filter by.
   * @returns The count of tasks with the specified status.
   */
  countTasksByStatus(status: string): number {
    const filteredTasks = this.tasks.filter(task => task.status === status);
    return filteredTasks.length;
  }


    /**
   * Counts tasks by their priority level (e.g., "high", "medium").
   * @param priority - The priority level of tasks to filter by.
   * @returns The count of tasks with the specified priority.
   */
  countTasksByPriority(priority: string): number {
    const filteredTasks = this.tasks.filter(task => task.priority === priority);
    return filteredTasks.length;
  }


    /**
   * Finds the nearest due date among the tasks and sets it as nearestDueDate.
   * If no tasks are available, sets nearestDueDate to null.
   */
  findNearestDueDate(): void {
    if (this.tasks.length === 0) {
      this.nearestDueDate = null;
      return;
    }

    const now = new Date().getTime();
    let nearestTask = this.tasks[0];
    let minDifference = Math.abs(new Date(nearestTask.due_date!).getTime() - now);

    this.tasks.forEach(task => {
      const difference = Math.abs(new Date(task.due_date!).getTime() - now);
      if (difference < minDifference) {
        minDifference = difference;
        nearestTask = task;
      }
    });

    this.nearestDueDate = new Date(nearestTask.due_date!);
  }


  /** Navigates to the Board page when the summary button is clicked. */
  goToBoardSummary() {
    this.router.navigate(['/board']);
  }
}
