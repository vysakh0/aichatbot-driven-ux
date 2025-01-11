import { useAtom } from "jotai";
import {
  chatMessagesAtom,
  chatInputAtom,
  getBotResponse,
  type Message,
} from "@/store/chat";

export function useChat() {
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const [input, setInput] = useAtom(chatInputAtom);

  const addMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        text: input.trim(),
        sender: "user",
        timestamp: Date.now(),
      };

      // Add bot response
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: getBotResponse(),
        sender: "bot",
        timestamp: Date.now() + 1,
      };

      setMessages((prev) => [...prev, userMessage, botMessage]);
      setInput("");
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    input,
    setInput,
    addMessage,
    clearChat,
  };
}
