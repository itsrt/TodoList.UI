import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TodoItemResponse, TodoItemCreateRequest } from './todo-item.model';
import { environment } from '../../../environments/environment';

@Service()
export class TodoItemService {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/todoList`;


    getTodoItems(): Observable<TodoItemResponse[]> {
        return this.http.get<TodoItemResponse[]>(this.baseUrl);
    }

    getTodoItemById(id: number): Observable<TodoItemResponse> {
        return this.http.get<TodoItemResponse>(`${this.baseUrl}/${id}`);
    }

    addTodoItem(todoItem: TodoItemCreateRequest): Observable<TodoItemResponse> {
        return this.http.post<TodoItemResponse>(this.baseUrl, todoItem);
    }

    deleteTodoItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

}
