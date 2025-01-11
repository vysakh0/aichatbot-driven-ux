import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

export const chatMessagesAtom = atomWithStorage<Message[]>("chat-messages", []);
export const chatInputAtom = atom("");

// Simple responses for the bot
const botResponses = [
  "That's interesting! Tell me more.",
  "I understand what you mean.",
  "How does that make you feel?",
  "What do you think about that?",
  "I'm here to listen.",
  "That's a great point!",
  "Could you elaborate on that?",
];

export const getBotResponse = () => {
  const randomIndex = Math.floor(Math.random() * botResponses.length);
  return botResponses[randomIndex];
};
