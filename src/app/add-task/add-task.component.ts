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
}