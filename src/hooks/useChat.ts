import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { chatMessagesAtom, chatInputAtom, type Message } from "@/store/chat";
import { useTodos } from "./useTodos";

export function useChat() {
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const [input, setInput] = useAtom(chatInputAtom);
  const [isLoading, setIsLoading] = useState(false);
  const { todos, addTodo, removeTodo } = useTodos();
  const router = useRouter();

  const addMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input.trim(),
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          todos,
          currentPath: window.location.pathname,
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();

      // Handle function calls from the AI
      if (data.functionCall) {
        let resultMessage = "";

        // Handle navigation first
        if (data.functionCall.name === "navigate") {
          const destination = data.functionCall.args.destination;
          router.push(destination);
          resultMessage = data.reply || `Navigating to ${destination}...`;
        } else {
          // Handle todo operations
          switch (data.functionCall.name) {
            case "addTodo": {
              const todo = await addTodo(data.functionCall.args.text);
              resultMessage = `Added todo: "${todo.text}"`;
              break;
            }
            case "removeTodo": {
              const todo = await removeTodo(data.functionCall.args.id);
              resultMessage = todo
                ? `Removed todo: "${todo.text}"`
                : "Todo not found";
              break;
            }
          }
        }

        const botMessage: Message = {
          id: crypto.randomUUID(),
          text: resultMessage,
          sender: "bot",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      // Handle normal replies
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: data.reply || "Sorry, I could not process that.",
        sender: "bot",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "Sorry, I couldn't process that request. Please try again.",
        sender: "bot",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
    isLoading,
  };
}
