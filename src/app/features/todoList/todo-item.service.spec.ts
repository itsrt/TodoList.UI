import { TestBed } from '@angular/core/testing';

import { TodoItemService } from './todo-item.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('TodoItemService', () => {
  let service: TodoItemService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  baseUrl = `${environment.apiUrl}/api/todoList`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(TodoItemService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('[INIT] should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[GET] should get todo items', () => {
    //Act - HTTP is generated
    service.getTodoItems().subscribe(todos => {
      //Assert
      expect(todos.length).toBe(1);
      expect(todos[0].header).toBe('Do Breakfast');
    });

    //Assert HTTP request
    const request = httpMock.expectOne(baseUrl);

    expect(request.request.method).toBe('GET');

    //Respond and Assert mock response
    request.flush([{
      id: 1,
      header: 'Do Breakfast',
      detail: 'Make and eat breakfast',
      completedBefore: '28/08/2026'
    }]);

  });

  it('[POST] should add new todo item', () => {

    const newTodoItem = {
      header: 'Do Laundry',
      detail: 'Wash and fold clothes',
      completedBefore: '28/08/2026'
    };

    service.addTodoItem(newTodoItem).subscribe(result => {
      expect(result.header).toBe('Do Laundry');
    })

    const request = httpMock.expectOne(baseUrl);

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual(newTodoItem);

    request.flush({
      id: 2,
      header: 'Do Laundry',
      detail: 'Wash and fold clothes',
      completedBefore: '28/08/2026'
    });
  });

  it('[DELETE] should delete todo item', () => {
    const todoItemIdToDelete = 1;

    service.deleteTodoItem(todoItemIdToDelete).subscribe();

    const request = httpMock.expectOne(`${baseUrl}/${todoItemIdToDelete}`);

    expect(request.request.method).toBe('DELETE');

    request.flush(null);

  });

  it('[ERROR] should handle ERROR when GETTING todo items fails', () => {

    service.getTodoItems().subscribe({
      next: () => {
        throw new Error('Fake Error');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    });

    const request = httpMock.expectOne(baseUrl);

    expect(request.request.method).toBe('GET');

    request.flush('Error fetching todo items',
      {
        status: 500,
        statusText: 'Internal Server Error'
      });
  });

  it('[ERROR] should handle ERROR when ADDING a new todo item fails', () => {

    const newTodoItem = {
      header: 'Do Laundry',
      detail: 'Wash and fold clothes',
      completedBefore: '28/08/2026'
    };

    service.addTodoItem(newTodoItem).subscribe({
      next: () => {
        throw new Error('Fake Error');
      },
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const request = httpMock.expectOne(baseUrl);

    expect(request.request.method).toBe('POST');

    request.flush('Error adding todo item',
      {
        status: 400,
        statusText: 'Bad Request'
      });
  });

  it('[ERROR] should handle ERROR when DELETING a todo item fails', () => {

    const todoItemIdToDelete = 1;

    service.deleteTodoItem(todoItemIdToDelete).subscribe({
      next: () => {
        throw new Error('Fake Error');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const request = httpMock.expectOne(`${baseUrl}/${todoItemIdToDelete}`);

    expect(request.request.method).toBe('DELETE');

    request.flush('Error deleting todo item',
      {
        status: 404,
        statusText: 'Not Found'
      });
  });

  afterEach(() => {
    httpMock.verify();
  });

});
