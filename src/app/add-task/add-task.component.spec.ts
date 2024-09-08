import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { AddTaskComponent } from './add-task.component';
import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { SubtaskService } from 'src/app/services/subtask.service';
import { Task } from 'src/app/services/task.service'; // Adjust the path as necessary
import { of } from 'rxjs';
import { Component, ViewChild, ElementRef, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from 'src/assets/models/contact.model';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';


describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [AddTaskComponent],
      providers: [
        TaskService,
        CategoryService,
        AddContactService,
        SubtaskService,
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
  
    // Mock initial data for categories and contacts
    spyOn(TestBed.inject(CategoryService), 'getCategories').and.returnValue(of([]));
    spyOn(TestBed.inject(AddContactService), 'getContacts').and.returnValue(of([]));
  
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

  it('should initialize form with default values', () => {
    expect(component.taskForm).toBeDefined();
    expect(component.taskForm.get('title')?.value).toEqual('');
    expect(component.taskForm.get('priority')?.value).toEqual('');
    expect(component.taskForm.get('category')?.value).toBeNull();
  });
  

  it('should have invalid form when required fields are empty', () => {
    component.taskForm.get('title')?.setValue('');
    component.taskForm.get('priority')?.setValue('');
    fixture.detectChanges();
    
    expect(component.taskForm.invalid).toBeTrue();
  });
  

  it('should toggle category dropdown', () => {
    component.toggleDropdown();
    fixture.detectChanges();
    
    expect(component.isOpen).toBeTrue();
    
    component.toggleDropdown();
    fixture.detectChanges();
    
    expect(component.isOpen).toBeFalse();
  });
  
  it('should select a category and close dropdown', () => {
    const category = { id: 1, name: 'Work', color: '#FF0000' };
    component.categories = [category];
    
    component.selectOption(category, new MouseEvent('click'));
    fixture.detectChanges();
    
    expect(component.selectedOption).toEqual(category);
    expect(component.isOpen).toBeFalse();
    expect(component.taskForm.get('category')?.value).toEqual(1);
  });
  

  it('should add a new subtask', () => {
    const subtaskText = 'New Subtask';
    component.subtaskInput.nativeElement.value = subtaskText;
    fixture.detectChanges();
    
    const addButton = fixture.debugElement.query(By.css('.checkContainer'));
    addButton.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    
    expect(component.subtasks.length).toBe(1);
    expect(component.subtasks[0].text).toEqual(subtaskText);
  });
  

  it('should create a task when form is valid', () => {
    const mockTask: Task = {
      title: 'Test Task',
      description: 'Test Description',
      category: 1,
      priority: 'Medium',
      due_date: '2024-09-01',
      assigned_to: [1, 2],
      subtasks: [
        { id: 1, text: 'Subtask 1', completed: false },
        { id: 2, text: 'Subtask 2', completed: true }
      ],
      contacts: [1, 2], // Add the required contacts field
    };
  
    spyOn(TestBed.inject(TaskService), 'addTask').and.returnValue(of(mockTask));
  
    component.taskForm.get('title')?.setValue('Test Task');
    component.taskForm.get('priority')?.setValue('Medium');
    component.taskForm.get('due_date')?.setValue({ year: 2024, month: 9, day: 1 });
    component.createTask();
  
    fixture.detectChanges();
  
    expect(TestBed.inject(TaskService).addTask).toHaveBeenCalled();
    expect(component.addTaskSuccess).toBeTrue();
  });

});
