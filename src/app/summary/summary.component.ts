import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/assets/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskService, Task } from 'src/app/services/task.service';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';

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
  showOverlaySummary: boolean = true;

  constructor(private userService: UserService, private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    const showOverlayStored = sessionStorage.getItem('showOverlaySummary');
    console.log(this.showOverlaySummary)
    this.loadTasks();
    this.greeting$ = this.userService.getCurrentUser().pipe(
      map(user => this.generateGreeting(user))
    );

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
    return filteredTasks.length;
  }

  countTasksByPriority(priority: string): number {
    const filteredTasks = this.tasks.filter(task => task.priority === priority);
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

  goToBoardSummary() {
    this.router.navigate(['/board']);
  }
}






