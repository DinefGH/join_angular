import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'src/app/services/task.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { AddContactService } from 'src/app/services/add-contact.service';
import { SubtaskService } from 'src/app/services/subtask.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Contact } from 'src/assets/models/contact.model';

describe('AddTaskComponent - ngOnInit', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  // Mock services
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockAddContactService: jasmine.SpyObj<AddContactService>;
  let mockSubtaskService: jasmine.SpyObj<SubtaskService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNgbDateParserFormatter: jasmine.SpyObj<NgbDateParserFormatter>;

  beforeEach(async () => {
    // Create spies for the services
    mockTaskService = jasmine.createSpyObj('TaskService', ['addTask']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategories']);
    mockAddContactService = jasmine.createSpyObj('AddContactService', ['getContacts']);
    mockSubtaskService = jasmine.createSpyObj('SubtaskService', ['addSubtask']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNgbDateParserFormatter = jasmine.createSpyObj('NgbDateParserFormatter', ['parse', 'format']);

    // Mock data
    const categories: Category[] = [
      { id: 1, name: 'Work', color: '#FF0000' },
      { id: 2, name: 'Personal', color: '#00FF00' },
    ];

    // Set up spies
    mockCategoryService.getCategories.and.returnValue(of(categories));

    await TestBed.configureTestingModule({
      declarations: [AddTaskComponent],
      imports: [ReactiveFormsModule, NgbModule],
      providers: [
        FormBuilder,
        { provide: TaskService, useValue: mockTaskService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: AddContactService, useValue: mockAddContactService },
        { provide: SubtaskService, useValue: mockSubtaskService },
        { provide: Router, useValue: mockRouter },
        { provide: NgbDateParserFormatter, useValue: mockNgbDateParserFormatter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;

    // Spy on loadContacts method
    spyOn(component, 'loadContacts').and.callThrough();

    // Initialize the component (this will call ngOnInit)
    fixture.detectChanges();
  });


  it('should call loadContacts()', () => {
    expect(component.loadContacts).toHaveBeenCalled();
  });

  it('should load categories from the service', () => {
    expect(mockCategoryService.getCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Work');
    expect(component.categories[1].name).toBe('Personal');
  });
});


