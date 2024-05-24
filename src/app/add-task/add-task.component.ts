import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @ViewChild('dpInput') dpInput!: ElementRef<HTMLInputElement>;
  minDate!: NgbDateStruct;
  taskForm: FormGroup;
  @ViewChild('subtaskInput') subtaskInput!: ElementRef<HTMLInputElement>;
  categories: Category[] = [];
  selectedOption?: Category;
  isOpen = false;

  addTaskSuccess = false
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  isOpenContacts = false;
  selectedContacts: number[] = [];
  maxVisibleContacts: number = 3;
  isInputFocused: boolean = false;

  subtasks: Subtask[] = [];
  newSubtask: string = '';

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private addContactService: AddContactService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: [null],
      priority: ['', Validators.required],
      due_date: [null],
      assigned_to: [[]],
      status: ['todo']
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.loadContacts();

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  onDateSelect(date: NgbDateStruct): void {
    const formattedDate = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    this.dpInput.nativeElement.value = formattedDate;
    this.taskForm.get('due_date')?.setValue(formattedDate);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  toggleDropdownContacts(): void {
    this.isOpenContacts = !this.isOpenContacts;
  }

  selectOption(category: Category, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedOption = category;
    this.taskForm.get('category')?.setValue(category.id);
    this.isOpen = false;
  }

  selectContact(contact: Contact, event: MouseEvent): void {
    this.selectedContact = contact;
    this.isOpenContacts = false;
    event.stopPropagation();
  }

  loadContacts(): void {
    this.addContactService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
      },
      error: (error) => {
        console.error('Failed to load contacts:', error);
      }
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) return '';

    let initials = name.split(' ')
      .filter((n) => n !== '')
      .map((n) => n[0]?.toUpperCase() ?? '')
      .slice(0, 2);

    return initials.join('');
  }

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

  handleContactClick(contactId: number, event: MouseEvent): void {
    event.stopPropagation();

    const index = this.selectedContacts.indexOf(contactId);
    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(contactId);
    }
  }

  getContactById(contactId: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === contactId);
  }

  toggleIcons(focused: boolean): void {
    if (!focused) {
      setTimeout(() => this.isInputFocused = focused, 100);
    } else {
      this.isInputFocused = focused;
    }
  }

  addSubtask(event: MouseEvent, subtaskValue: string): void {
    event.preventDefault();
    const trimmedValue = subtaskValue.trim();
    if (trimmedValue) {
      const newSubtask = { text: trimmedValue, completed: false };
      this.subtaskService.createSubtask(newSubtask).subscribe({
        next: (subtask) => {
          this.subtasks.push(subtask);
          this.clearInput();
        },
        error: (error) => console.error('Failed to save subtask:', error)
      });
    }
  }

  clearInput(): void {
    this.subtaskInput.nativeElement.value = '';
  }

  deleteSubtask(index: number): void {
    this.subtasks.splice(index, 1);
  }

  editSubtask(index: number, subtaskText: string): void {
    const editedSubtaskText = prompt('Edit Subtask:', subtaskText);
    if (editedSubtaskText !== null && editedSubtaskText.trim() !== '') {
      const subtask = this.subtasks[index];
      if (subtask && subtask.id !== undefined) {
        subtask.text = editedSubtaskText.trim();

        this.subtaskService.updateSubtask(subtask.id, subtask).subscribe({
          next: (updatedSubtask) => {
            console.log('Subtask updated successfully:', updatedSubtask);
          },
          error: (error) => {
            console.error('Failed to update subtask:', error);
            alert('Failed to update subtask. Please try again.');
          }
        });
      } else {
        console.error('Subtask ID is undefined, cannot update subtask.');
        alert('Subtask cannot be updated as it lacks a valid ID.');
      }
    }
  }

  createTask(): void {
    if (!this.taskForm.valid) {
      console.log('Form is not valid');
      this.logFormErrors();
      return;
    }

    const formattedData = this.prepareSubmitData();
    console.log('Data sent to the backend:', formattedData);

    this.taskService.addTask(formattedData).subscribe({
      next: (task) => {
        console.log('Task created successfully:', task);
        this.taskForm.reset();
        this.subtasks = [];
        
      },
      error: (error) => {
        console.error('Failed to create task:', error);
        alert('Failed to create task: ' + (error.error.message || error.message));
      }
    });


    this.addTaskSuccess = true
    setTimeout(() => {
      this.router.navigate(['/board']);
    }, 3000);
  }

  logFormErrors() {
    console.log('Form Errors:', this.taskForm.errors);
  }

  updateTask(taskId: number): void {
    this.taskService.updateTask(taskId, this.taskForm.value).subscribe({
      next: (task) => console.log('Task updated successfully:', task),
      error: (error) => console.error('Failed to update task:', error)
    });
  }

  prepareSubmitData() {
    const formData = this.taskForm.value;

    if (formData.due_date) {
      const { year, month, day } = formData.due_date;
      formData.due_date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    formData.assigned_to = this.selectedContacts;
    formData.subtasks = this.subtasks.map(subtask => ({
      id: subtask.id,
      text: subtask.text,
      completed: subtask.completed
    }));

    return formData;
  }
}