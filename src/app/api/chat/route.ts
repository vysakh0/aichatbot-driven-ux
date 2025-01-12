import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Updated function definitions with correct routes
const functions = [
  {
    name: "todoOperation",
    description: "Navigate and perform todo operations",
    parameters: {
      type: "object",
      properties: {
        navigation: {
          type: "object",
          description: "Navigation details",
          properties: {
            destination: {
              type: "string",
              enum: ["/", "/profile"],
              description: "The page to navigate to",
            },
          },
          required: ["destination"],
        },
        todo: {
          type: "object",
          description: "Todo operation details",
          properties: {
            operation: {
              type: "string",
              enum: ["add", "remove"],
              description: "The type of todo operation",
            },
            text: {
              type: "string",
              description: "The text for new todo (for add operation)",
            },
            id: {
              type: "string",
              description: "The todo ID (for remove operation)",
            },
          },
          required: ["operation"],
        },
      },
      required: ["navigation", "todo"],
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
