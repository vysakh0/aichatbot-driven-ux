import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export interface Todo {
  id: string;
  text: string;
}

export const todosAtom = atomWithStorage<Todo[]>("todos", []);
export const todoInputAtom = atom("");
