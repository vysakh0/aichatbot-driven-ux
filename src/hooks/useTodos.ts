import { useAtom } from "jotai";
import { todosAtom, inputAtom } from "@/store/todos";

export function useTodos() {
  const [todos, setTodos] = useAtom(todosAtom);
  const [input, setInput] = useAtom(inputAtom);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([
        ...todos,
        {
          id: crypto.randomUUID(),
          text: input.trim(),
        },
      ]);
      setInput("");
    }
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return {
    todos,
    input,
    setInput,
    addTodo,
    removeTodo,
  };
}
