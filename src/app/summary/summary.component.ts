import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/assets/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskService, Task } from 'src/app/services/task.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})

export class SummaryComponent implements OnInit {
  currentDate = new Date();
  greeting$: Observable<string> | undefined;
  currentUser: User | null = null;
  tasks: Task[] = [];
  nearestDueDate: Date | null = null;

  constructor(private userService: UserService, private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
    this.greeting$ = this.userService.getCurrentUser().pipe(
      map(user => this.generateGreeting(user))
    );

    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

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


  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      tasks => {
        this.tasks = tasks;
        this.findNearestDueDate();
      },
      error => {
        console.error('Error loading tasks:', error);
        // Handle error loading tasks
      }
    );
  }

  countTasksByStatus(status: string): number {
    const filteredTasks = this.tasks.filter(task => task.status === status);
    console.log(`Tasks with status '${status}':`, filteredTasks);
    return filteredTasks.length;
  }

  countTasksByPriority(priority: string): number {
    const filteredTasks = this.tasks.filter(task => task.priority === priority);
    console.log(`Tasks with priority '${priority}':`, filteredTasks);
    return filteredTasks.length;
  }



  findNearestDueDate(): void {
    if (this.tasks.length === 0) {
      this.nearestDueDate = null;
      return;
    }

    // Find the task with the nearest due_date
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
}





