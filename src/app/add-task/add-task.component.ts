import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TaskService}from 'src/app/services/task.service';
import {CategoryService, Category}from 'src/app/services/category.service';



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
  
  subtasks: string[] = [];
  public newSubtask: string = '';

  
  constructor(private ngbDateParserFormatter: NgbDateParserFormatter, private addContactService: AddContactService,private fb: FormBuilder, private categoryService: CategoryService, private taskService: TaskService ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: [null],
      priority: ['', Validators.required],
      dueDate: [''],
      assignedTo: [[]] 
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
    const formattedDate = this.ngbDateParserFormatter.format(date);
    this.taskForm.get('dueDate')?.setValue(formattedDate);
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
    const currentContacts = this.taskForm.get('assignedTo')?.value || [];
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
    this.taskForm.get('assignedTo')?.setValue(currentContacts);
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
  console.log('Function start'); // Debug log
  event.preventDefault();
  event.stopPropagation();
  
  console.log('Input value:', subtaskValue); // Debug log
  
  if (subtaskValue.trim()) {
      this.subtasks.push(subtaskValue.trim());
      console.log('Subtask saved:', subtaskValue.trim()); // Debug log
      // Additional logic to clear the input field, if necessary
      this.subtaskInput.nativeElement.value = ''; // Clear the input field
  }
  
  if (this.subtaskInput) {
      console.log('Blurring input field'); // Debug log
      this.subtaskInput.nativeElement.blur();
      this.isInputFocused = false
  } else {
      console.log('Input reference not found'); // Debug log
  }
}

clearInput(): void {
  this.subtaskInput.nativeElement.value = '';
}


deleteSubtask(index: number): void {
  this.subtasks.splice(index, 1); // Removes the subtask at the specified index
}

editSubtask(index: number, subtask: string): void {
  // Example editing logic
  const editedSubtask = prompt('Edit Subtask:', subtask); // Prompt user for new subtask text
  if (editedSubtask !== null && editedSubtask.trim() !== '') {
    this.subtasks[index] = editedSubtask.trim(); // Update the subtask
  }
}

createTask(): void {
  this.taskService.addTask(this.taskForm.value).subscribe({
    next: (task) => {
      console.log('Task created successfully:', task);
      this.taskForm.reset();
    },
    error: (error) => {
      console.error('Failed to create task:', error);
      alert('Failed to create task: ' + (error.error.message || error.message));
    }
  });
}

onSubmit(): void {
  if (this.taskForm.valid) {
    console.log('Form Values:', this.taskForm.value);
    this.createTask();
  } else {
    console.log('Form is not valid');
    // Log detailed validation errors
    Object.keys(this.taskForm.controls).forEach(key => {
      const controlErrors = this.taskForm.get(key)?.errors;
      if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value:', controlErrors[keyError]);
          });
      }
    });
  }
}

updateTask(taskId: number): void {
  this.taskService.updateTask(taskId, this.taskForm.value).subscribe({
    next: (task) => console.log('Task updated successfully:', task),
    error: (error) => console.error('Failed to update task:', error)
  });
}
}