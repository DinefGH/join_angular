import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TaskService}from 'src/app/services/task.service';
import {CategoryService, Category}from 'src/app/services/category.service';
import {SubtaskService, Subtask}from 'src/app/services/subtask.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @ViewChild('dpInput') dpInput!: ElementRef<HTMLInputElement>;
  minDate!: NgbDateStruct; // To prevent past dates selection
  taskForm: FormGroup;
  @ViewChild('subtaskInput') subtaskInput!: ElementRef<HTMLInputElement>;
  categories: Category[] = [];
  selectedOption?: Category;
  isOpen = false;


  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  isOpenContacts= false;
  selectedContacts: number[] = [];
  maxVisibleContacts: number = 3;
  isInputFocused: boolean = false;
  
  subtasks: Subtask[] = [];
  public newSubtask: string = '';

  
  constructor(private ngbDateParserFormatter: NgbDateParserFormatter, private addContactService: AddContactService,private fb: FormBuilder, private categoryService: CategoryService, private taskService: TaskService, private subtaskService: SubtaskService ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: [null],
      priority: ['', Validators.required],
      due_date: [null],
      assigned_to: [[]] 
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
    this.dpInput.nativeElement.value = formattedDate; // Display the formatted date in the input
    this.taskForm.get('due_date')?.setValue(formattedDate); // Update the form control with the formatted string
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
    this.isOpen = false; // Optionally close the dropdown after selection
    event.stopPropagation(); // Prevent the dropdown from toggling when an option is selected
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
    if (!name) return ''; // This will catch both undefined and empty string cases
  
    let initials = name.split(' ')
                      .filter((n) => n !== '')
                      .map((n) => n[0]?.toUpperCase() ?? '') // Use ?. in case a split result is an empty string
                      .slice(0, 2); // Only take the first two parts for initials
    
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
    event.stopPropagation(); // Prevent click event from closing the dropdown
  
    const index = this.selectedContacts.indexOf(contactId);
    if (index > -1) {
      this.selectedContacts.splice(index, 1); // Remove the contact ID if it's already selected
    } else {
      this.selectedContacts.push(contactId); // Add the contact ID if it's not already selected
    }
  }
  getContactById(contactId: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === contactId);
  }

  toggleIcons(focused: boolean): void {
    if (!focused) {
        setTimeout(() => this.isInputFocused = focused, 100); // Adjust delay as needed
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
    if (subtask && subtask.id !== undefined) {  // Check that id is defined
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

  // Create the main task without subtasks
  this.taskService.addTask(formattedData).subscribe({
    next: (task) => {
      console.log('Task created successfully:', task);
      this.taskForm.reset(); // Reset the form after successful creation
    },
    error: (error) => {
      console.error('Failed to create task:', error);
      alert('Failed to create task: ' + (error.error.message || error.message));
    }
  });
}

logFormErrors() {
  throw new Error('Method not implemented.');
}

updateTask(taskId: number): void {
  this.taskService.updateTask(taskId, this.taskForm.value).subscribe({
    next: (task) => console.log('Task updated successfully:', task),
    error: (error) => console.error('Failed to update task:', error)
  });
}

prepareSubmitData() {
  const formData = this.taskForm.value;

  // Format dueDate if it exists
  if (formData.due_date) {
    const { year, month, day } = formData.due_date;
    formData.due_date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  formData.assigned_to = this.selectedContacts;

  return formData;
}

}