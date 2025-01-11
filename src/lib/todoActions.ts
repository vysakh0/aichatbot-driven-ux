import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export interface Todo {
  id: string;
  text: string;
}

// Create an atom for storing todos
export const todosAtom = atomWithStorage<Todo[]>("todos", []);

// Create a class to handle todo operations
class TodoManager {
  private static instance: TodoManager;
  private todoStore: Todo[] = [];

  private constructor() {
    // Initialize from localStorage if available
    const stored = localStorage.getItem("todos");
    if (stored) {
      this.todoStore = JSON.parse(stored);
    }
  }

  public static getInstance(): TodoManager {
    if (!TodoManager.instance) {
      TodoManager.instance = new TodoManager();
    }
    return TodoManager.instance;
  }

  private updateStorage() {
    localStorage.setItem("todos", JSON.stringify(this.todoStore));
  }

  async addTodo(text: string) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
    };

    this.todoStore = [...this.todoStore, newTodo];
    this.updateStorage();

    return {
      message: `Added todo: "${text}"`,
      data: newTodo,
      type: "add" as const,
    };
  }

  async removeTodo(id: string) {
    const todoToRemove = this.todoStore.find((todo) => todo.id === id);

    if (!todoToRemove) {
      return {
        message: "Todo item not found",
        data: null,
        type: "remove" as const,
      };
    }

    this.todoStore = this.todoStore.filter((todo) => todo.id !== id);
    this.updateStorage();

    return {
      message: `Removed todo: "${todoToRemove.text}"`,
      data: todoToRemove,
      type: "remove" as const,
    };
  }

  getTodos() {
    return this.todoStore;
  }
}

export const todoManager = TodoManager.getInstance();
