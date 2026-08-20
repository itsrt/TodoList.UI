import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TodoItemService } from '../todo-item.service';
import { TodoItemResponse, TodoItemCreateRequest } from '../todo-item.model';

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})



export class TodoList {
  private readonly formBuilder = inject(FormBuilder);
  private readonly todoListService = inject(TodoItemService);


  todoList = signal<TodoItemResponse[]>([]);

  todoForm = this.formBuilder.nonNullable.group({
    header: ['', Validators.required],
    detail: [''],
    completedBefore: ['', Validators.required]
  });

  ngOnInit() {
    this.todoListService.getTodoItems().subscribe({
      next: (data) => {
        //console.log('Fetched todo items:', data);
        this.todoList.set(data);
      },
      error: (error) => {
        console.error('Error fetching todo items:', error);
      }
    });
  }


  addTodoItem(): void {

    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const newTodoItem = this.todoForm.getRawValue();

    this.todoListService.addTodoItem(newTodoItem).subscribe({
      next: (addedTodoItem) => {
        //console.log('Added todo item:', addedTodoItem);
        this.todoList.update((list) => [...list, addedTodoItem]);
        this.todoForm.reset();
      },
      error: (error) => {
        console.error('Error adding todo item:', error);
      }
    });
  }


  deleteTodoItem(id: number) {
    this.todoListService.deleteTodoItem(id).subscribe({

      next: () => {
        //console.log('Deleted todo item with id:', id);
        this.todoList.update((list) => list.filter(todo => todo.id !== id));
        //console.log('Updated todo list after deletion:', this.todoList);
      },
      error: (error) => {
        console.error('Error deleting todo item:', error);
      }
    });
  }
}
