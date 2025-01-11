import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface Todo {
  id: string;
  text: string;
}

// This will persist todos in localStorage
export const todosAtom = atomWithStorage<Todo[]>("todos", []);
export const inputAtom = atom("");
