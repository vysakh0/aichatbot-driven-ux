import { useAtom } from "jotai";
import { todosAtom, todoInputAtom, type Todo } from "@/store/todos";

export function useTodos() {
  const [todos, setTodos] = useAtom(todosAtom);
  const [input, setInput] = useAtom(todoInputAtom);

  const addTodo = async (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
    };
    setTodos((prev) => [...prev, newTodo]);
    return newTodo;
  };

  const removeTodo = async (id: string) => {
    const todoToRemove = todos.find((todo) => todo.id === id);
    if (todoToRemove) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      return todoToRemove;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input);
      setInput("");
    }
  };

  return {
    todos,
    input,
    setInput,
    addTodo,
    removeTodo,
    handleSubmit,
  };
}
