import { useAtom } from "jotai";
import { chatMessagesAtom, chatInputAtom, type Message } from "@/store/chat";

export function useChat() {
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const [input, setInput] = useAtom(chatInputAtom);

  const addMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        text: input.trim(),
        sender: "user",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        // Get AI response
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage.text }),
        });

        if (!response.ok) throw new Error("Failed to get AI response");

        const data = await response.json();

        // Add bot message
        const botMessage: Message = {
          id: crypto.randomUUID(),
          text: data.reply,
          sender: "bot",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error getting AI response:", error);

        // Add error message
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          text: "Sorry, I couldn't process that request. Please try again.",
          sender: "bot",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
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
