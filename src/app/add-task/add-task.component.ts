import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @ViewChild('dpInput') dpInput!: ElementRef<HTMLInputElement>;
  minDate!: NgbDateStruct; // To prevent past dates selection
  @ViewChild('subtaskInput') subtaskInput!: ElementRef<HTMLInputElement>;



  options = [
    { name: 'User Story', color: '#FF0000' },
    { name: 'Technical Task', color: '#00FF00' },
    { name: 'Backend', color: '#0000FF' },
    { name: 'Design', color: '#FFD700' }, // Example color
    { name: 'Sales', color: '#4B0082' }, // Example color
    { name: 'Backoffice', color: '#FF4500' }, // Example color
    { name: 'Marketing', color: '#20B2AA' }, // Example color
    { name: 'Other', color: '#808080' } // Example color
  ];

  selectedOption?: { name: string; color: string };  isOpen = false; // Controls the visibility of the dropdown
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  isOpenContacts= false;
  selectedContacts: number[] = [];
  maxVisibleContacts: number = 3;
  isInputFocused: boolean = false;
  
  subtasks: string[] = [];
  public newSubtask: string = '';


  constructor(private ngbDateParserFormatter: NgbDateParserFormatter, private addContactService: AddContactService) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.loadContacts();
  }

  onDateSelect(date: NgbDateStruct): void {
    const formattedDate = this.ngbDateParserFormatter.format(date);
    this.dpInput.nativeElement.value = formattedDate;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  toggleDropdownContacts(): void {
    this.isOpenContacts = !this.isOpenContacts;
  }

  selectOption(option: { name: string; color: string }, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click event from bubbling up to the container
    this.selectedOption = option;
    this.isOpen = false; // Close dropdown after selection
    console.log(`Option selected: ${this.selectedOption.name} with color ${this.selectedOption.color}`);
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
    if (isChecked) {
      // Add contact ID to selectedContacts if not already present
      if (!this.selectedContacts.includes(contactId)) {
        this.selectedContacts.push(contactId);
      }
    } else {
      // Remove contact ID from selectedContacts if unchecked
      this.selectedContacts = this.selectedContacts.filter(id => id !== contactId);
    }
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
}