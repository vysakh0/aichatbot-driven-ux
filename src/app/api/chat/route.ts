import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Updated function definitions with correct routes
const functions = [
  {
    name: "navigate",
    description: "Navigate to a specific page or section of the application",
    parameters: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          description: "The page or section to navigate to",
          enum: ["/", "/profile"], // Using actual route paths
        },
      },
      required: ["destination"],
    },
  },
  {
    name: "addTodo",
    description: "Add a new todo item to the list (can be done from any page)",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text content of the todo item",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "removeTodo",
    description:
      "Remove a todo item from the list by its ID (can be done from any page)",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The ID of the todo item to remove",
        },
      },
      required: ["id"],
    },
  },
];

export async function POST(request: Request) {
  try {
    const { message, todos, currentPath } = await request.json();

    const systemMessage = `You are a helpful assistant managing a todo list. The application has two pages:
    - Home page (/) where users manage their todos
    - Profile page (/profile) where users can update their profile

    Important workflow:
    1. When a user wants to manage todos, first navigate to home page (/) if not already there
    2. Then proceed with todo operations (add/remove)

    Current location: ${currentPath}
    Current todos: ${
      todos.length > 0
        ? todos.map((t: any) => `"${t.text}" (ID: ${t.id})`).join(", ")
        : "no todos yet"
    }`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        { role: "user", content: message },
      ],
      model: "gpt-4",
      functions,
      function_call: "auto",
    });

    const responseMessage = completion.choices[0].message;

    // If the model wants to call a function, return the function call details
    if (responseMessage.function_call) {
      const { name, arguments: args } = responseMessage.function_call;
      return NextResponse.json({
        functionCall: {
          name,
          args: JSON.parse(args),
        },
        reply: responseMessage.content,
      });
    }

    // Otherwise return the normal reply
    return NextResponse.json({ reply: responseMessage.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
