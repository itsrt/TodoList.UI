//Todo Component and UI Tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoList } from './todo-list';
import { of } from 'rxjs/internal/observable/of';
import { TodoItemService } from '../todo-item.service';

const mockTodoItems = {

  "id": 1,
  "header": "Do Breakfast",
  "detail": "Boiled Eggs, Avocados, Milk",
  "createdOn": "2026-08-19T02:50:53.5176127Z",
  "completedBefore": "2026-08-19"

};

const mockCreatedTodoItems = {

  "id": 2,
  "header": "Do Shopping",
  "detail": "Eggs, Avocados, Milk",
  "createdOn": "2026-08-19T02:50:53.5176127Z",
  "completedBefore": "2026-08-19"

};

let fixture: ComponentFixture<TodoList>;
let component: TodoList;

async function createComponent() {
  fixture = TestBed.createComponent(TodoList);
  component = fixture.componentInstance;

  await fixture.whenStable();

  return { fixture, component };

}

describe('TodoList Component and UI Tests', () => {

  let mockTodoItemServiceInstance: {
    getTodoItems: ReturnType<typeof vi.fn>;
    addTodoItem: ReturnType<typeof vi.fn>;
    deleteTodoItem: ReturnType<typeof vi.fn>;
  }

  beforeEach(async () => {

    mockTodoItemServiceInstance = {
      getTodoItems: vi.fn(() => of([mockTodoItems])),
      addTodoItem: vi.fn((todoItem) => of(mockCreatedTodoItems)),
      deleteTodoItem: vi.fn((id) => of(void 0))
    }

    await TestBed.configureTestingModule({
      imports: [TodoList],
      providers: [
        {
          provide: TodoItemService,
          useValue: mockTodoItemServiceInstance
        }
      ]
    }).compileComponents();
  });

  it('[Component] should create todo component', async () => {

    const { component } = await createComponent();

    expect(component).toBeTruthy();
  });

  it('[Component] should load todo items', async () => {
    // Arrange
    const { component } = await createComponent();
    // Assert
    expect(component.todoList().length).toBe(1);
    expect(component.todoList()[0].header).toBe('Do Breakfast');
  });

  it('[Component] should load empty todo items', async () => {
    // Arrange
    mockTodoItemServiceInstance.getTodoItems.mockReturnValue(of([]));

    const { component } = await createComponent();
    // Assert
    expect(component.todoList().length).toBe(0);
  });

  it('[Component] should add a new todo item', async () => {
    // Arrange
    const { component } = await createComponent();

    component.todoForm.setValue({
      header: mockCreatedTodoItems.header,
      detail: mockCreatedTodoItems.detail,
      completedBefore: mockCreatedTodoItems.completedBefore
    });
    //Act
    component.addTodoItem();
    //Assert
    expect(mockTodoItemServiceInstance.addTodoItem).toHaveBeenCalled();

    expect(component.todoList().length).toBe(2);
    expect(component.todoList()[1].header).toBe('Do Shopping');
  });

  it('[Component] should delete a todo item', async () => {
    // Arrange
    const { component } = await createComponent();
    const todoItemIdToDelete = mockTodoItems.id;

    // Act
    component.deleteTodoItem(todoItemIdToDelete);

    // Assert
    expect(mockTodoItemServiceInstance.deleteTodoItem).toHaveBeenCalledWith(todoItemIdToDelete);
    expect(component.todoList().length).toBe(0);
  });

  it('[Component] should empty todo list when delete button is clicked', async () => {
    // Arrange
    const { component, fixture } = await createComponent();

    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    //Act
    deleteButton.click();
    await fixture.whenStable();

    // Assert
    expect(component.todoList().length).toBe(0);
  });

  it('[UI] should disable add when form is invalid', async () => {
    // Arrange
    const { component, fixture } = await createComponent();

    component.todoForm.setValue({
      header: '',
      detail: mockCreatedTodoItems.detail,
      completedBefore: mockCreatedTodoItems.completedBefore
    });

    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector('button[type="submit"]');
    // Assert
    expect(addButton.disabled).toBe(true);
    expect(mockTodoItemServiceInstance.addTodoItem).not.toHaveBeenCalled();
    expect(component.todoList().length).toBe(1);
  });

  it('[UI] should enable add when form is valid', async () => {
    // Arrange
    const { component, fixture } = await createComponent();

    component.todoForm.setValue({
      header: 'New Todo Item',
      detail: mockCreatedTodoItems.detail,
      completedBefore: mockCreatedTodoItems.completedBefore
    });

    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector('button[type="submit"]');
    // Assert
    expect(addButton.disabled).toBe(false);
    expect(mockTodoItemServiceInstance.addTodoItem).not.toHaveBeenCalled();
    expect(component.todoList().length).toBe(1);
  });

  it('[UI] should add todo when add button is clicked and form is valid', async () => {
    // Arrange
    const { component, fixture } = await createComponent();

    component.todoForm.setValue({
      header: 'New Todo Item',
      detail: mockCreatedTodoItems.detail,
      completedBefore: mockCreatedTodoItems.completedBefore
    });

    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector('button[type="submit"]');
    //Act
    addButton.click();

    // Assert
    expect(mockTodoItemServiceInstance.addTodoItem).toHaveBeenCalled();
    expect(component.todoList().length).toBe(2);
  });

  it('[UI] should reflect on UI newly added todo when add button is clicked', async () => {
    // Arrange
    const { component, fixture } = await createComponent();

    component.todoForm.setValue({
      header: mockCreatedTodoItems.header,
      detail: mockCreatedTodoItems.detail,
      completedBefore: mockCreatedTodoItems.completedBefore
    });

    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector('button[type="submit"]');
    //Act
    addButton.click();

    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(mockTodoItemServiceInstance.addTodoItem).toHaveBeenCalled();
    expect(component.todoList().length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain(mockCreatedTodoItems.header);
    console.log(fixture.nativeElement.textContent);

  });

  it('[UI] should reset todo form when add button is clicked', async () => {
    // Arrange
    const { component, fixture } = await createComponent();

    component.todoForm.setValue({
      header: mockCreatedTodoItems.header,
      detail: mockCreatedTodoItems.detail,
      completedBefore: mockCreatedTodoItems.completedBefore
    });

    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector('button[type="submit"]');
    //Act
    addButton.click();

    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(component.todoForm.value.header).toBe('');
    expect(component.todoForm.value.detail).toBe('');
    expect(component.todoForm.value.completedBefore).toBe('');

  });

  it('[UI] should invoke delete todo when delete button is clicked', async () => {
    // Arrange
    const { component, fixture } = await createComponent();

    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    //Act
    deleteButton.click();

    // Assert
    console.log('deleteTodo calls:', mockTodoItemServiceInstance.deleteTodoItem.mock.calls);
    expect(mockTodoItemServiceInstance.deleteTodoItem).toHaveBeenCalledOnce();
    expect(component.todoList().length).toBe(0);
  });

  it('[UI] should not show delete button when todo list is empty', async () => {
    // Arrange
    const { component, fixture } = await createComponent();

    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    //Act
    deleteButton.click();
    await fixture.whenStable();
    fixture.detectChanges();
    // Assert
    const deleteButtonAfterDeletion = fixture.nativeElement.querySelector('.delete-button');
    expect(deleteButtonAfterDeletion).toBeNull();
  });

});
