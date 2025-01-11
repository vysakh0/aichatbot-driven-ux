"use client";

import { useTodos } from "@/hooks/useTodos";
import { useChat } from "@/hooks/useChat";
import { format } from "date-fns";

export default function Home() {
  const {
    todos,
    input: todoInput,
    setInput: setTodoInput,
    addTodo,
    removeTodo,
  } = useTodos();
  const {
    messages,
    input: chatInput,
    setInput: setChatInput,
    addMessage,
    clearChat,
  } = useChat();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Todo List Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Todo List</h1>
          </div>

          <form onSubmit={addTodo} className="mb-6 flex gap-2">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </form>

          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <span>{todo.text}</span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Chat with Bot</h1>
            <button
              onClick={clearChat}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear Chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow mb-6 p-4 h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {format(message.timestamp, "HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={addMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
